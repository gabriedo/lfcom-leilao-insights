import logging
from typing import Dict, Any, Optional
from ..models.pre_analysis_log import PreAnalysisLog, PreAnalysisLogCreate
from datetime import datetime

logger = logging.getLogger(__name__)

async def save_pre_analysis(url: str, result: Optional[Dict[str, Any]] = None, error: Optional[str] = None) -> None:
    """
    Salva os dados da pré-análise no MongoDB.
    
    Args:
        url: URL da propriedade analisada
        result: Dicionário com os dados extraídos (opcional)
        error: Mensagem de erro (opcional)
    """
    try:
        # Determina o status baseado nos parâmetros
        status = "completed" if result and not error else "error"
        
        # Cria o documento de log
        log_data = PreAnalysisLogCreate(
            url=url,
            status=status,
            result=result,
            error=error,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Salva no MongoDB
        await PreAnalysisLog.save(log_data)
        
        if status == "completed":
            logger.info(f"Pré-análise salva com sucesso para URL: {url}")
        else:
            logger.error(f"Erro na pré-análise para URL: {url} - {error}")
            
    except Exception as e:
        logger.error(f"Erro ao salvar pré-análise para URL {url}: {str(e)}")
        raise

async def save_pre_analysis_from_url(url: str) -> None:
    """
    Salva uma pré-análise apenas com a URL, sem dados extraídos.
    Útil para registrar tentativas de análise.
    
    Args:
        url: URL da propriedade a ser analisada
    """
    try:
        log_data = PreAnalysisLogCreate(
            url=url,
            status="pending",
            result=None,
            error=None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        await PreAnalysisLog.save(log_data)
        logger.info(f"Registro de pré-análise criado para URL: {url}")
        
    except Exception as e:
        logger.error(f"Erro ao criar registro de pré-análise para URL {url}: {str(e)}")
        raise 