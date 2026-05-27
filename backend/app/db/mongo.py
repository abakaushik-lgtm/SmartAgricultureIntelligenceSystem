from collections.abc import AsyncGenerator

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import get_settings


client: AsyncIOMotorClient | None = None


async def connect_to_mongo() -> None:
    global client
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongo_uri)
    await client.admin.command("ping")


async def close_mongo_connection() -> None:
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if client is None:
        raise RuntimeError("MongoDB client is not initialized")
    return client[get_settings().mongo_db]


async def get_db() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    yield get_database()
