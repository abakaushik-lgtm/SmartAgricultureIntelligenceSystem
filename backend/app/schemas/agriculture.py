from datetime import datetime

from pydantic import BaseModel, Field


class CropCreate(BaseModel):
    name: str
    variety: str | None = None
    region: str
    acreage: float = Field(gt=0)
    planting_date: datetime


class SoilAnalysisRequest(BaseModel):
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=300)
    ph: float = Field(ge=0, le=14)
    moisture: float = Field(ge=0, le=100)
    crop: str


class SoilAnalysisResponse(BaseModel):
    health_score: int
    status: str
    fertilizer_recommendation: str
    amendments: list[str]


class FertilizerRecommendationRequest(BaseModel):
    crop: str
    growth_stage: str = Field(default="vegetative", max_length=80)
    acreage: float = Field(gt=0)
    nitrogen: float = Field(ge=0, le=300)
    phosphorus: float = Field(ge=0, le=300)
    potassium: float = Field(ge=0, le=300)
    ph: float = Field(ge=0, le=14)
    moisture: float = Field(ge=0, le=100)
    organic_matter_percent: float | None = Field(default=None, ge=0, le=20)
    irrigation_available: bool = True


class FertilizerProductRecommendation(BaseModel):
    product: str
    nutrient_focus: str
    application_rate_kg_per_acre: float
    timing: str
    method: str


class FertilizerRecommendationResponse(BaseModel):
    crop: str
    growth_stage: str
    nutrient_status: dict[str, str]
    priority: str
    recommended_products: list[FertilizerProductRecommendation]
    application_plan: list[str]
    soil_amendments: list[str]
    cautions: list[str]
    estimated_total_kg: float
    confidence: float


class WeatherForecast(BaseModel):
    location: str
    forecast_days: int = 7


class YieldPredictionRequest(BaseModel):
    crop: str
    region: str
    acreage: float = Field(gt=0)
    rainfall_mm: float = Field(ge=0)
    avg_temperature_c: float
    soil_health_score: float = Field(ge=0, le=100)


class YieldPredictionResponse(BaseModel):
    predicted_yield_tons: float
    confidence: float
    drivers: list[str]


class ModelStatusResponse(BaseModel):
    disease_model_available: bool
    yield_model_available: bool
    disease_model_path: str
    yield_model_path: str


class DiseaseDetectionResponse(BaseModel):
    crop: str
    disease: str
    confidence: float
    severity: str
    treatment: list[str]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    language: str = "en"
    context: dict[str, str] | None = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[str] = []
