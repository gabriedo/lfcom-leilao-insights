import logging
from typing import Dict, Any, Optional
from ..models.pre_analysis_log import PreAnalysisLog, PreAnalysisLogCreate
from datetime import datetime
from ..config import MongoDB

logger = logging.getLogger(__name__)

async def save_pre_analysis(url: str, result: Optional[Dict[str, Any]] = None, error: Optional[str] = None) -> None:
    """
    Salva os dados da pré-análise no MongoDB.
    Faz merge dos novos dados extraídos com os antigos salvos no MongoDB.
    Nunca sobrescreve o campo `result` com {} se já existirem dados válidos.
    Adiciona logs que mostram o valor de result antes e depois da atualização.
    Args:
        url: URL da propriedade analisada
        result: Dicionário com os dados extraídos (opcional)
        error: Mensagem de erro (opcional)
    """
    try:
        db = MongoDB.get_database()
        collection = db.pre_analysis_logs
        existing = await collection.find_one({"url": url})
        previous = existing.get("result", {}) if existing else {}
        # Se result for None ou vazio, mantém o anterior
        if not result:
            merged_result = previous
        else:
            # Faz merge: mantém campos antigos se os novos vierem vazios
            merged_result = {**previous, **{k: v for k, v in (result or {}).items() if v not in [None, '', [], {}]}}
        logger.info(f"[SAVE] Anterior: {previous}")
        logger.info(f"[SAVE] Extraído: {result}")
        logger.info(f"[SAVE] Final salvo: {merged_result}")
        status = "completed" if merged_result and not error else "error"
        log_data = {
            "url": url,
            "status": status,
            "result": merged_result,
            "error": error,
            "updated_at": datetime.utcnow(),
        }
        if not existing:
            log_data["created_at"] = datetime.utcnow()
            await collection.insert_one(log_data)
            logger.info(f"[SAVE] Novo registro salvo para {url} com dados: {merged_result}")
        else:
            await collection.update_one(
                {"_id": existing["_id"]},
                {"$set": log_data}
            )
            logger.info(f"[SAVE] Registro atualizado para {url} com dados: {merged_result}")
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