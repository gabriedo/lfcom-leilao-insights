from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db = None

    @classmethod
    async def connect_to_database(cls, url: str = "mongodb://localhost:27017"):
        cls.client = AsyncIOMotorClient(url)
        cls.db = cls.client.leilao_insights

    @classmethod
    async def close_database_connection(cls):
        if cls.client:
            cls.client.close()

    @classmethod
    def get_database(cls):
        return cls.db 