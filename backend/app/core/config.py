from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "AgriNexus AI"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    cors_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:5173", "http://127.0.0.1:5173"]
    )

    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "agrinexus"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60

    firebase_project_id: str | None = None
    openai_api_key: str | None = None
    gemini_api_key: str | None = None
    weather_api_key: str | None = None
    disease_model_path: str = "ai-models/disease-detection/runs/best.pt"
    yield_model_path: str = "ai-models/yield-prediction/yield_model.joblib"


@lru_cache
def get_settings() -> Settings:
    return Settings()
