from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do logging
logger = logging.getLogger(__name__)

# Configurações do MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "leilao_insights")

# Cliente MongoDB
client = None

async def get_database():
    """
    Retorna uma conexão com o banco de dados MongoDB.
    """
    global client
    
    try:
        if client is None:
            client = AsyncIOMotorClient(MONGODB_URL)
            # Verifica a conexão
            await client.admin.command('ping')
            logger.info("Conexão com MongoDB estabelecida com sucesso")
            
        return client[DATABASE_NAME]
        
    except Exception as e:
        logger.error(f"Erro ao conectar com MongoDB: {str(e)}")
        return None

async def close_database():
    """
    Fecha a conexão com o banco de dados.
    """
    global client
    
    if client is not None:
        client.close()
        client = None
        logger.info("Conexão com MongoDB fechada")

class MongoDB:
    client = None
    db = None

    @classmethod
    async def connect_to_database(cls, url: str):
        try:
            logger.info(f"Conectando ao MongoDB em: {url}")
            cls.client = AsyncIOMotorClient(url)
            # Testa a conexão
            await cls.client.admin.command('ping')
            logger.info("Conexão com MongoDB estabelecida com sucesso!")
            
            # Configura o banco de dados
            db_name = os.getenv("MONGODB_DB", "leilao_insights")
            cls.db = cls.client[db_name]
            logger.info(f"Banco de dados '{db_name}' configurado")
            
            # Cria índices necessários
            await cls.create_indexes()
            
        except Exception as e:
            logger.error(f"Erro ao conectar com MongoDB: {str(e)}", exc_info=True)
            raise

    @classmethod
    async def create_indexes(cls):
        try:
            # Índice para url_logs
            await cls.db.url_logs.create_index("url", unique=True)
            await cls.db.url_logs.create_index("dominio")
            await cls.db.url_logs.create_index("timestamp")
            
            # Índice para extraction_results
            await cls.db.extraction_results.create_index("url")
            await cls.db.extraction_results.create_index("timestamp")
            
            # Índice para pre_analysis_logs
            await cls.db.pre_analysis_logs.create_index("url", unique=True)
            await cls.db.pre_analysis_logs.create_index("dominio")
            await cls.db.pre_analysis_logs.create_index("data")
            
            logger.info("Índices criados com sucesso")
        except Exception as e:
            logger.error(f"Erro ao criar índices: {str(e)}", exc_info=True)
            raise

    @classmethod
    async def close_database_connection(cls):
        try:
            if cls.client:
                cls.client.close()
                cls.client = None
                cls.db = None
                logger.info("Conexão com MongoDB fechada com sucesso")
        except Exception as e:
            logger.error(f"Erro ao fechar conexão com MongoDB: {str(e)}", exc_info=True)
            raise

    @classmethod
    def get_database(cls):
        if not cls.db:
            logger.error("Database não inicializado")
            raise Exception("Database not initialized")
        return cls.db 