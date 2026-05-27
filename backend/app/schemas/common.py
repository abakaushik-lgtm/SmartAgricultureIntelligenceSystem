from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class PyObjectId(str):
    pass


class APIMessage(BaseModel):
    message: str


class TimestampedModel(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    detail: str
    code: str = "APPLICATION_ERROR"
    meta: dict[str, Any] | None = None
