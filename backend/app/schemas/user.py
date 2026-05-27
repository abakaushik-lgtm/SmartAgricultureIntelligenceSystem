from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    farmer = "farmer"
    admin = "admin"
    agronomist = "agronomist"


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.farmer
    region: str | None = None
    preferred_language: str = "en"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class FirebaseLogin(BaseModel):
    id_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole


class UserPublic(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: UserRole
    region: str | None = None
    preferred_language: str = "en"
    is_active: bool = True
