import logging
from datetime import datetime
from typing import Optional, Dict, Any
from urllib.parse import urlparse
from backend.models.pre_analysis_log import PreAnalysisLogCreate
from backend.config import get_database

logger = logging.getLogger(__name__)

async def save_pre_analysis(url: str, status: str, error: Optional[str] = None, result: Optional[Dict[str, Any]] = None) -> None:
    """
    Salva os dados da pré-análise no MongoDB.
    
    Args:
        url: URL do imóvel analisado
        status: Status da análise (pending, completed, error)
        error: Mensagem de erro, se houver
        result: Resultado da análise, se houver
    """
    try:
        db = get_database()
        if db is None:
            raise ValueError("Database connection is not available")
            
        collection = db.pre_analysis_logs
        
        log_data = PreAnalysisLogCreate(
            url=url,
            status=status,
            error=error,
            result=result
        )
        
        await collection.insert_one(log_data.dict())
        logger.info(f"Pré-análise salva com sucesso para URL: {url}")
        
    except Exception as e:
        logger.error(f"Erro ao salvar pré-análise para URL {url}: {str(e)}")
        raise

async def save_pre_analysis_from_url(url: str, dados_extraidos: Dict[str, Any], status: str = "sucesso") -> None:
    """
    Salva uma pré-análise bem-sucedida no MongoDB.
    Em caso de erro, apenas loga o erro e continua a execução.
    """
    try:
        # Extrai o domínio da URL
        dominio = urlparse(url).netloc
        
        # Cria o objeto de log
        log_data = PreAnalysisLogCreate(
            url=url,
            dominio=dominio,
            dados_extraidos=dados_extraidos,
            status=status
        )
        
        # Obtém a conexão com o banco
        db = get_database()
        if db is None:
            raise ValueError("Database connection is not available")
            
        # Atualiza ou insere o documento
        collection = db.pre_analysis_logs
        await collection.update_one(
            {"url": url},  # Filtro
            {"$set": log_data.dict()},  # Dados a serem atualizados
            upsert=True  # Cria se não existir
        )
        
        logger.info(f"Pré-análise salva com sucesso para URL: {url}")
        
    except Exception as e:
        logger.error(f"Erro ao salvar pré-análise para URL {url}: {str(e)}")
        # Não propaga o erro para não afetar a resposta da API 