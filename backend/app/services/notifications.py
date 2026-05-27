from datetime import datetime, timezone
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.schemas.notification import (
    NotificationCategory,
    NotificationChannel,
    NotificationCreate,
    NotificationSeverity,
)


async def create_notification(
    db: AsyncIOMotorDatabase,
    *,
    user_id: str,
    title: str,
    message: str,
    category: NotificationCategory = NotificationCategory.system,
    severity: NotificationSeverity = NotificationSeverity.info,
    channels: list[NotificationChannel] | None = None,
    metadata: dict[str, Any] | None = None,
) -> str:
    payload = NotificationCreate(
        user_id=user_id,
        title=title,
        message=message,
        category=category,
        severity=severity,
        channels=channels or [NotificationChannel.in_app],
        metadata=metadata or {},
    )
    now = datetime.now(timezone.utc)
    document = payload.model_dump(mode="json")
    document.update({"is_read": False, "read_at": None, "created_at": now, "updated_at": now})
    result = await db.notifications.insert_one(document)
    return str(result.inserted_id)


async def create_soil_notification(db: AsyncIOMotorDatabase, user_id: str, crop: str, status: str, score: int) -> None:
    if status == "excellent":
        return
    severity = NotificationSeverity.critical if status == "critical" else NotificationSeverity.warning
    await create_notification(
        db,
        user_id=user_id,
        title=f"Soil health needs attention for {crop}",
        message=f"Soil analysis returned a {status} score of {score}. Review fertilizer and amendment advice.",
        category=NotificationCategory.soil,
        severity=severity,
        metadata={"crop": crop, "health_score": score, "status": status},
    )


async def create_disease_notification(
    db: AsyncIOMotorDatabase,
    user_id: str,
    crop: str,
    disease: str,
    confidence: float,
) -> None:
    if disease.lower().startswith("healthy"):
        await create_notification(
            db,
            user_id=user_id,
            title=f"Disease scan complete for {crop}",
            message="No visible disease was detected. Continue routine field scouting.",
            category=NotificationCategory.disease,
            severity=NotificationSeverity.info,
            metadata={"crop": crop, "disease": disease, "confidence": confidence},
        )
        return

    await create_notification(
        db,
        user_id=user_id,
        title=f"Possible {disease} detected",
        message=f"The disease scan found {disease} with {round(confidence * 100)}% confidence. Review treatment steps.",
        category=NotificationCategory.disease,
        severity=NotificationSeverity.critical,
        metadata={"crop": crop, "disease": disease, "confidence": confidence},
    )


async def create_weather_notifications(
    db: AsyncIOMotorDatabase,
    user_id: str,
    location: str,
    forecast: list[dict[str, Any]],
) -> None:
    heavy_rain = next((day for day in forecast if day.get("rainfall_mm", 0) >= 15), None)
    high_temp = next((day for day in forecast if day.get("temperature_c", 0) >= 31), None)

    if heavy_rain:
        await create_notification(
            db,
            user_id=user_id,
            title=f"Rain alert for {location}",
            message=f"Expected rainfall is {heavy_rain['rainfall_mm']} mm on {heavy_rain['date']}. Adjust irrigation plans.",
            category=NotificationCategory.weather,
            severity=NotificationSeverity.warning,
            metadata={"location": location, "forecast_day": heavy_rain},
        )

    if high_temp:
        await create_notification(
            db,
            user_id=user_id,
            title=f"Heat stress risk for {location}",
            message=f"Temperature may reach {high_temp['temperature_c']} C on {high_temp['date']}. Monitor crop moisture.",
            category=NotificationCategory.weather,
            severity=NotificationSeverity.warning,
            metadata={"location": location, "forecast_day": high_temp},
        )
