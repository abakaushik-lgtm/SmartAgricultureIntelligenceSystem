from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class NotificationCategory(str, Enum):
    soil = "soil"
    fertilizer = "fertilizer"
    yield_prediction = "yield_prediction"
    disease = "disease"
    weather = "weather"
    system = "system"


class NotificationSeverity(str, Enum):
    info = "info"
    warning = "warning"
    critical = "critical"


class NotificationChannel(str, Enum):
    in_app = "in_app"
    email = "email"
    sms = "sms"
    whatsapp = "whatsapp"
    push = "push"


class NotificationCreate(BaseModel):
    user_id: str
    title: str = Field(min_length=2, max_length=140)
    message: str = Field(min_length=2, max_length=500)
    category: NotificationCategory = NotificationCategory.system
    severity: NotificationSeverity = NotificationSeverity.info
    channels: list[NotificationChannel] = Field(default_factory=lambda: [NotificationChannel.in_app])
    metadata: dict[str, Any] = Field(default_factory=dict)


class NotificationPublic(BaseModel):
    id: str
    title: str
    message: str
    category: NotificationCategory
    severity: NotificationSeverity
    channels: list[NotificationChannel]
    metadata: dict[str, Any] = Field(default_factory=dict)
    is_read: bool = False
    read_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class NotificationListResponse(BaseModel):
    notifications: list[NotificationPublic]
    unread_count: int


class NotificationCountResponse(BaseModel):
    unread_count: int
