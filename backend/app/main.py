from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.routes_admin import router as admin_router
from app.api.routes_agriculture import router as agriculture_router
from app.api.routes_auth import router as auth_router
from app.api.routes_notifications import router as notifications_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.mongo import close_mongo_connection, connect_to_mongo
from app.websockets.monitoring import router as websocket_router

configure_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_mongo()
        logger.info("MongoDB connected")
    except Exception as exc:
        logger.warning("MongoDB connection failed: %s", exc)
    yield
    await close_mongo_connection()


settings = get_settings()
app = FastAPI(
    title=settings.app_name,
    description="AI-powered smart agriculture intelligence platform.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error", "code": "INTERNAL_ERROR"})


@app.get("/health", tags=["system"])
async def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "environment": settings.environment}


@app.get("/", tags=["system"])
async def root() -> dict:
    return {
        "service": settings.app_name,
        "status": "running",
        "docs": "/docs",
        "health": "/health",
        "api_base": settings.api_v1_prefix,
        "message": "AgriNexus AI backend is running. Open /docs for Swagger API documentation.",
    }


app.include_router(auth_router, prefix=settings.api_v1_prefix)
app.include_router(agriculture_router, prefix=settings.api_v1_prefix)
app.include_router(admin_router, prefix=settings.api_v1_prefix)
app.include_router(notifications_router, prefix=settings.api_v1_prefix)
app.include_router(websocket_router)
