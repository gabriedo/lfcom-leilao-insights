import logging
from models.url_log import URLLogCreate
from config import MongoDB

logger = logging.getLogger(__name__)

async def log_url(log_data: URLLogCreate):
    """
    Registra uma URL no banco de dados.
    """
    try:
        db = MongoDB.get_database()
        await db.url_logs.insert_one(log_data.dict())
        logger.info(f"URL registrada com sucesso: {log_data.url}")
    except Exception as e:
        logger.error(f"Erro ao registrar URL: {str(e)}")
        raise 