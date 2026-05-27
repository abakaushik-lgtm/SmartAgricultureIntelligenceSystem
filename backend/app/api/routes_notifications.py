from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, HTTPException, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user
from app.db.mongo import get_db
from app.schemas.notification import NotificationCountResponse, NotificationListResponse, NotificationPublic

router = APIRouter(prefix="/notifications", tags=["notifications"])


def _serialize_notification(document: dict) -> NotificationPublic:
    return NotificationPublic(
        id=str(document["_id"]),
        title=document["title"],
        message=document["message"],
        category=document["category"],
        severity=document["severity"],
        channels=document.get("channels", ["in_app"]),
        metadata=document.get("metadata", {}),
        is_read=document.get("is_read", False),
        read_at=document.get("read_at"),
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )


def _object_id(notification_id: str) -> ObjectId:
    try:
        return ObjectId(notification_id)
    except InvalidId as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid notification id") from exc


@router.get("", response_model=NotificationListResponse)
async def list_notifications(
    unread_only: bool = False,
    limit: int = Query(default=25, ge=1, le=100),
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> NotificationListResponse:
    query: dict = {"user_id": user["id"]}
    if unread_only:
        query["is_read"] = False

    rows = []
    cursor = db.notifications.find(query).sort("created_at", -1).limit(limit)
    async for notification in cursor:
        rows.append(_serialize_notification(notification))

    unread_count = await db.notifications.count_documents({"user_id": user["id"], "is_read": False})
    return NotificationListResponse(notifications=rows, unread_count=unread_count)


@router.get("/unread-count", response_model=NotificationCountResponse)
async def unread_count(
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> NotificationCountResponse:
    count = await db.notifications.count_documents({"user_id": user["id"], "is_read": False})
    return NotificationCountResponse(unread_count=count)


@router.patch("/{notification_id}/read", response_model=NotificationPublic)
async def mark_notification_read(
    notification_id: str,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> NotificationPublic:
    now = datetime.now(timezone.utc)
    result = await db.notifications.update_one(
        {"_id": _object_id(notification_id), "user_id": user["id"]},
        {"$set": {"is_read": True, "read_at": now, "updated_at": now}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")

    notification = await db.notifications.find_one({"_id": _object_id(notification_id), "user_id": user["id"]})
    if notification is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
    return _serialize_notification(notification)


@router.patch("/read-all", response_model=NotificationCountResponse)
async def mark_all_notifications_read(
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> NotificationCountResponse:
    now = datetime.now(timezone.utc)
    await db.notifications.update_many(
        {"user_id": user["id"], "is_read": False},
        {"$set": {"is_read": True, "read_at": now, "updated_at": now}},
    )
    return NotificationCountResponse(unread_count=0)
