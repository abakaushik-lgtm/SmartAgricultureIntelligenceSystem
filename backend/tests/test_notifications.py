from bson import ObjectId
import pytest

from app.schemas.notification import NotificationCategory, NotificationSeverity
from app.services.notifications import create_notification, create_soil_notification


class InsertResult:
    def __init__(self) -> None:
        self.inserted_id = ObjectId()


class FakeCollection:
    def __init__(self) -> None:
        self.documents = []

    async def insert_one(self, document: dict) -> InsertResult:
        self.documents.append(document)
        return InsertResult()


class FakeDatabase:
    def __init__(self) -> None:
        self.notifications = FakeCollection()


@pytest.mark.anyio
async def test_create_notification_stores_unread_document():
    db = FakeDatabase()

    notification_id = await create_notification(
        db,
        user_id="user-1",
        title="Irrigation alert",
        message="Moisture is below the target range.",
        category=NotificationCategory.soil,
        severity=NotificationSeverity.warning,
    )

    assert notification_id
    assert db.notifications.documents[0]["user_id"] == "user-1"
    assert db.notifications.documents[0]["is_read"] is False
    assert db.notifications.documents[0]["category"] == "soil"
    assert db.notifications.documents[0]["severity"] == "warning"


@pytest.mark.anyio
async def test_soil_notification_skips_excellent_soil():
    db = FakeDatabase()

    await create_soil_notification(db, "user-1", "wheat", "excellent", 92)

    assert db.notifications.documents == []
