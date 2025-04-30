from motor.motor_asyncio import AsyncIOMotorClient
from ..core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    async def connect_to_mongodb(self):
        """Conecta ao MongoDB"""
        try:
            self.client = AsyncIOMotorClient(settings.MONGODB_URL)
            self.db = self.client[settings.MONGODB_DB]
            logger.info("Conectado ao MongoDB com sucesso!")
        except Exception as e:
            logger.error(f"Erro ao conectar ao MongoDB: {str(e)}")
            raise e

    async def close_mongodb_connection(self):
        """Fecha a conexão com o MongoDB"""
        if self.client:
            self.client.close()
            logger.info("Conexão com o MongoDB fechada!")

mongodb = MongoDB() 