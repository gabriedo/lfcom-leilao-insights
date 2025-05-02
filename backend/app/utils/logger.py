from ..models.url_log import URLLog
from ..db.mongodb import mongodb
import logging

logger = logging.getLogger(__name__)

async def log_url(data: URLLog) -> URLLog:
    """
    Salva um log de URL no MongoDB, evitando duplicidade.
    
    Args:
        data (URLLog): Dados do log a serem salvos
        
    Returns:
        URLLog: O log salvo com ID e timestamp
    """
    try:
        # Verifica se já existe um log para esta URL
        existing_log = await mongodb.db.url_logs.find_one({"url": data.url})
        
        if existing_log:
            logger.info(f"Log já existe para URL: {data.url}")
            return URLLog(**existing_log)
        
        # Converte o modelo Pydantic para dict
        log_data = data.model_dump(by_alias=True)
        
        # Insere no MongoDB
        result = await mongodb.db.url_logs.insert_one(log_data)
        
        # Atualiza o ID no objeto
        data.id = result.inserted_id
        
        logger.info(f"Log de URL salvo com sucesso: {data.url}")
        return data
        
    except Exception as e:
        logger.error(f"Erro ao salvar log de URL: {str(e)}")
        raise 