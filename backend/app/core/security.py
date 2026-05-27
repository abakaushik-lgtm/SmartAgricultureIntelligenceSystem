from datetime import datetime, timedelta, timezone
import hashlib
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings


def _password_digest(password: str) -> bytes:
    return hashlib.sha256(password.encode("utf-8")).hexdigest().encode("ascii")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_password_digest(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(_password_digest(password), hashed_password.encode("utf-8"))


def create_access_token(subject: str, role: str, extra: dict[str, Any] | None = None) -> str:
    settings = get_settings()
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_minutes)
    payload: dict[str, Any] = {"sub": subject, "role": role, "exp": expires}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("Invalid authentication token") from exc
