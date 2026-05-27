from datetime import datetime
from pathlib import Path

from fastapi import APIRouter, Depends, File, UploadFile
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user
from app.core.config import get_settings
from app.db.mongo import get_db
from app.schemas.agriculture import (
    ChatRequest,
    ChatResponse,
    DiseaseDetectionResponse,
    FertilizerRecommendationRequest,
    FertilizerRecommendationResponse,
    ModelStatusResponse,
    SoilAnalysisRequest,
    SoilAnalysisResponse,
    WeatherForecast,
    YieldPredictionRequest,
    YieldPredictionResponse,
)
from app.services.chatbot import answer_agriculture_question
from app.services.disease_detection import DiseaseDetectionService
from app.services.fertilizer import recommend_fertilizer
from app.services.notifications import (
    create_disease_notification,
    create_notification,
    create_soil_notification,
    create_weather_notifications,
)
from app.services.soil import analyze_soil
from app.services.weather import get_weather_forecast
from app.services.yield_prediction import predict_yield
from app.schemas.notification import NotificationCategory, NotificationSeverity

router = APIRouter(tags=["agriculture intelligence"])


@router.post("/soil/analyze", response_model=SoilAnalysisResponse)
async def soil_analysis(
    payload: SoilAnalysisRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> SoilAnalysisResponse:
    result = analyze_soil(payload)
    await db.soil_reports.insert_one(
        {
            "user_id": user["id"],
            "crop": payload.crop,
            "parameters": payload.model_dump(exclude={"crop"}),
            "health_score": result.health_score,
            "recommendation": result.fertilizer_recommendation,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    await create_soil_notification(db, user["id"], payload.crop, result.status, result.health_score)
    return result


@router.post("/fertilizer/recommend", response_model=FertilizerRecommendationResponse)
async def fertilizer_recommendation(
    payload: FertilizerRecommendationRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> FertilizerRecommendationResponse:
    result = recommend_fertilizer(payload)
    await db.fertilizer_recommendations.insert_one(
        {
            "user_id": user["id"],
            "crop": payload.crop,
            "growth_stage": payload.growth_stage,
            "inputs": payload.model_dump(),
            "output": result.model_dump(),
            "priority": result.priority,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    if result.priority in {"medium", "high"}:
        await create_notification(
            db,
            user_id=user["id"],
            title=f"Fertilizer plan ready for {payload.crop}",
            message=f"{result.priority.title()} priority nutrient action recommended for {payload.growth_stage} stage.",
            category=NotificationCategory.fertilizer,
            severity=NotificationSeverity.warning if result.priority == "medium" else NotificationSeverity.critical,
            metadata={
                "crop": payload.crop,
                "growth_stage": payload.growth_stage,
                "priority": result.priority,
                "estimated_total_kg": result.estimated_total_kg,
            },
        )
    return result


@router.post("/yield/predict", response_model=YieldPredictionResponse)
async def yield_prediction(
    payload: YieldPredictionRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> YieldPredictionResponse:
    result = predict_yield(payload)
    await db.predictions.insert_one(
        {
            "user_id": user["id"],
            "crop": payload.crop,
            "prediction_type": "yield",
            "inputs": payload.model_dump(),
            "output": result.model_dump(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    await create_notification(
        db,
        user_id=user["id"],
        title=f"Yield prediction ready for {payload.crop}",
        message=f"Estimated yield is {result.predicted_yield_tons} tons with {round(result.confidence * 100)}% confidence.",
        category=NotificationCategory.yield_prediction,
        severity=NotificationSeverity.info,
        metadata={"crop": payload.crop, "region": payload.region, "predicted_yield_tons": result.predicted_yield_tons},
    )
    return result


@router.get("/ml/status", response_model=ModelStatusResponse)
async def ml_status() -> ModelStatusResponse:
    settings = get_settings()
    return ModelStatusResponse(
        disease_model_available=Path(settings.disease_model_path).exists(),
        yield_model_available=Path(settings.yield_model_path).exists(),
        disease_model_path=settings.disease_model_path,
        yield_model_path=settings.yield_model_path,
    )


@router.post("/disease/detect", response_model=DiseaseDetectionResponse)
async def disease_detection(
    crop: str = "unknown",
    image: UploadFile = File(...),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> DiseaseDetectionResponse:
    service = DiseaseDetectionService(get_settings().disease_model_path)
    result = await service.detect(image=image, crop=crop)
    await db.disease_reports.insert_one(
        {
            "user_id": user["id"],
            "crop": crop,
            "image_url": image.filename,
            "disease": result.disease,
            "confidence": result.confidence,
            "treatment": result.treatment,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    await create_disease_notification(db, user["id"], crop, result.disease, result.confidence)
    return result


@router.post("/weather/forecast")
async def weather(
    payload: WeatherForecast,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    result = await get_weather_forecast(payload.location, payload.forecast_days)
    await create_weather_notifications(db, user["id"], payload.location, result["forecast"])
    return result


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> ChatResponse:
    result = await answer_agriculture_question(payload)
    await db.chat_history.insert_one(
        {
            "user_id": user["id"],
            "message": payload.message,
            "answer": result.answer,
            "language": payload.language,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )
    return result
