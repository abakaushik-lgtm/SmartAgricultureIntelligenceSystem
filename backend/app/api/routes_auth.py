from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.dependencies import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongo import get_db
from app.schemas.user import TokenResponse, UserCreate, UserLogin, UserPublic

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)) -> TokenResponse:
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email is already registered")
    user_doc = payload.model_dump()
    password = user_doc.pop("password")
    user_doc["password_hash"] = hash_password(password)
    user_doc["created_at"] = datetime.utcnow()
    user_doc["updated_at"] = datetime.utcnow()
    user_doc["is_active"] = True
    await db.users.insert_one(user_doc)
    token = create_access_token(payload.email, payload.role.value)
    return TokenResponse(access_token=token, role=payload.role)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)) -> TokenResponse:
    user = await db.users.find_one({"email": payload.email, "is_active": True})
    if not user or not user.get("password_hash") or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(user["email"], user["role"])
    return TokenResponse(access_token=token, role=user["role"])


@router.get("/me", response_model=UserPublic)
async def me(user: dict = Depends(get_current_user)) -> UserPublic:
    return UserPublic(
        id=str(user.get("_id", ObjectId())),
        name=user["name"],
        email=user["email"],
        role=user["role"],
        region=user.get("region"),
        preferred_language=user.get("preferred_language", "en"),
        is_active=user.get("is_active", True),
    )
