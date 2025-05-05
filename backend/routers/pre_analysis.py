from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any
import logging
import traceback
from urllib.parse import urlparse, urlunparse
from ..models.pre_analysis_log import PreAnalysisLog
from ..services.analysis_service import analyze_property
from ..utils.pre_analysis_logger import save_pre_analysis_from_url

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/pre-analysis/{url:path}")
async def get_pre_analysis(url: str) -> Dict[str, Any]:
    """
    Obtém a pré-análise de uma propriedade em leilão.
    Se não existir, inicia uma nova análise em background.
    """
    try:
        # Normaliza a URL (remove query params irrelevantes e trailing slashes)
        parsed = urlparse(url)
        normalized_url = urlunparse(parsed._replace(query="", fragment="")).rstrip("/")
        logger.info(f"[PRE-ANALYSIS] URL recebida: {url}")
        logger.info(f"[PRE-ANALYSIS] URL normalizada: {normalized_url}")

        filtro = {"url": normalized_url}
        logger.info(f"[PRE-ANALYSIS] Filtro para find_one: {filtro}")

        try:
            analysis = await PreAnalysisLog.find_one(filtro)
        except Exception as e:
            logger.error(f"[PRE-ANALYSIS] Erro no find_one: {str(e)}\n{traceback.format_exc()}")
            raise HTTPException(status_code=500, detail="Erro ao buscar análise no banco de dados.")

        if analysis:
            logger.info(f"[PRE-ANALYSIS] Pré-análise encontrada para URL: {normalized_url}")
            data = analysis.model_dump()
            data.pop("_id", None)
            data.pop("__v", None)
            return data
        else:
            logger.info(f"[PRE-ANALYSIS] Nenhuma análise encontrada para esta URL: {normalized_url}")

        # Se não existe, inicia uma nova análise em background
        logger.info(f"[PRE-ANALYSIS] Iniciando nova análise para URL: {normalized_url}")
        await save_pre_analysis_from_url(normalized_url)

        background_tasks = BackgroundTasks()
        background_tasks.add_task(analyze_property, normalized_url)

        return {
            "url": normalized_url,
            "status": "pending",
            "message": "Análise iniciada em background"
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[PRE-ANALYSIS] Erro inesperado ao buscar/iniciar pré-análise para URL {url}: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar/iniciar pré-análise. Consulte os logs para detalhes.")

@router.post("/pre-analysis/{url:path}")
async def create_pre_analysis(url: str, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """
    Inicia uma nova pré-análise de uma propriedade em leilão.
    """
    try:
        logger.info(f"Iniciando nova pré-análise para URL: {url}")
        # Verifica se já existe uma análise
        existing_analysis = await PreAnalysisLog.find_one({"url": url})
        if existing_analysis:
            logger.info(f"Pré-análise já existe para URL: {url}")
            return existing_analysis.model_dump()
        # Cria um registro pendente
        await save_pre_analysis_from_url(url)
        # Inicia a análise em background
        background_tasks.add_task(analyze_property, url)
        return {
            "url": url,
            "status": "pending",
            "message": "Análise iniciada em background"
        }
    except Exception as e:
        error_msg = f"Erro ao iniciar pré-análise para URL {url}: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/analysis-results/{url:path}")
async def get_analysis_results(url: str) -> Dict[str, Any]:
    """
    Retorna os resultados da análise completa.
    """
    try:
        logger.info(f"Buscando resultados para URL: {url}")
        # Busca a análise no banco de dados
        analysis = await PreAnalysisLog.find_one({"url": url})
        if not analysis:
            logger.warning(f"Análise não encontrada para URL: {url}")
            raise HTTPException(status_code=404, detail="Análise não encontrada")
        if analysis.status == "error":
            logger.info(f"Análise com erro para URL: {url}")
            return {
                "status": "error",
                "error": analysis.error,
                "result": None
            }
        if analysis.status == "pending":
            logger.info(f"Análise em andamento para URL: {url}")
            return {
                "status": "pending",
                "message": "Análise em andamento"
            }
        logger.info(f"Análise completa para URL: {url}")
        return {
            "status": "completed",
            "result": analysis.result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar resultados para URL {url}: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar resultados") 