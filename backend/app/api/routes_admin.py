from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import require_roles
from app.db.mongo import get_db
from app.schemas.user import UserRole

router = APIRouter(prefix="/admin", tags=["admin"], dependencies=[Depends(require_roles(UserRole.admin))])


@router.get("/overview")
async def overview(db: AsyncIOMotorDatabase = Depends(get_db)) -> dict:
    return {
        "users": await db.users.count_documents({}),
        "soil_reports": await db.soil_reports.count_documents({}),
        "fertilizer_recommendations": await db.fertilizer_recommendations.count_documents({}),
        "disease_reports": await db.disease_reports.count_documents({}),
        "predictions": await db.predictions.count_documents({}),
        "notifications": await db.notifications.count_documents({}),
        "unread_notifications": await db.notifications.count_documents({"is_read": False}),
        "model_performance": {"disease_detector_map50": 0.86, "yield_rmse": 0.41},
    }


@router.get("/users")
async def users(db: AsyncIOMotorDatabase = Depends(get_db)) -> list[dict]:
    rows = []
    async for user in db.users.find({}, {"password_hash": 0}).limit(100):
        user["id"] = str(user.pop("_id"))
        rows.append(user)
    return rows
