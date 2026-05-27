from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field

from app.schemas.user import UserRole
from app.schemas.notification import NotificationCategory, NotificationChannel, NotificationSeverity


class MongoDocument(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserDocument(MongoDocument):
    name: str
    email: EmailStr
    password_hash: str | None = None
    firebase_uid: str | None = None
    role: UserRole = UserRole.farmer
    region: str | None = None
    preferred_language: str = "en"
    is_active: bool = True


class CropDocument(MongoDocument):
    user_id: str
    name: str
    variety: str | None = None
    region: str
    acreage: float
    planting_date: datetime


class PredictionDocument(MongoDocument):
    user_id: str
    crop: str
    prediction_type: str
    inputs: dict[str, Any]
    output: dict[str, Any]


class WeatherDocument(MongoDocument):
    location: str
    raw_payload: dict[str, Any]
    recommendations: list[str]


class SoilReportDocument(MongoDocument):
    user_id: str
    crop: str
    parameters: dict[str, float]
    health_score: int
    recommendation: str


class FertilizerRecommendationDocument(MongoDocument):
    user_id: str
    crop: str
    growth_stage: str
    inputs: dict[str, Any]
    output: dict[str, Any]
    priority: str


class DiseaseReportDocument(MongoDocument):
    user_id: str
    crop: str
    image_url: str | None = None
    disease: str
    confidence: float
    treatment: list[str]


class ChatHistoryDocument(MongoDocument):
    user_id: str
    message: str
    answer: str
    language: str


class NotificationDocument(MongoDocument):
    user_id: str
    title: str
    message: str
    category: NotificationCategory
    severity: NotificationSeverity = NotificationSeverity.info
    channels: list[NotificationChannel] = Field(default_factory=lambda: [NotificationChannel.in_app])
    metadata: dict[str, Any] = Field(default_factory=dict)
    is_read: bool = False
    read_at: datetime | None = None
