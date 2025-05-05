from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from typing import Optional, Dict, Any
from backend.models.pre_analysis_log import PreAnalysisLog, PreAnalysisLogCreate
from backend.services.analysis_service import analyze_property
from backend.utils.pre_analysis_logger import save_pre_analysis
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/pre-analysis/{url:path}")
async def get_pre_analysis(url: str) -> PreAnalysisLog:
    """
    Retorna a análise prévia de uma URL.
    """
    try:
        # Busca a análise no banco de dados
        analysis = await PreAnalysisLog.find_one({"url": url})
        if not analysis:
            raise HTTPException(status_code=404, detail="Análise não encontrada")
        return analysis
    except Exception as e:
        logger.error(f"Erro ao buscar análise para URL {url}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar análise")

@router.post("/pre-analysis")
async def create_pre_analysis(url: str = Query(..., description="URL do leilão a ser analisado"), background_tasks: BackgroundTasks = None) -> Dict[str, Any]:
    """
    Inicia uma nova análise prévia para uma URL.
    A análise é executada em background.
    """
    try:
        logger.info(f"Recebendo requisição para análise da URL: {url}")
        
        # Verifica se já existe uma análise
        existing_analysis = await PreAnalysisLog.find_one({"url": url})
        if existing_analysis:
            logger.info(f"Análise já existe para URL: {url}")
            return {
                "message": "Análise já existe",
                "analysis_id": str(existing_analysis.id),
                "status": existing_analysis.status
            }
        
        # Cria uma nova análise com status "pending"
        analysis = PreAnalysisLogCreate(
            url=url,
            status="pending",
            error=None,
            result=None
        )
        saved_analysis = await analysis.save()
        logger.info(f"Nova análise criada com ID: {saved_analysis.id}")
        
        # Inicia a análise em background
        background_tasks.add_task(analyze_property, url)
        
        return {
            "message": "Análise iniciada",
            "analysis_id": str(saved_analysis.id),
            "status": "pending"
        }
        
    except Exception as e:
        logger.error(f"Erro ao iniciar análise para URL {url}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao iniciar análise")

@router.get("/analysis-results/{url:path}")
async def get_analysis_results(url: str) -> Dict[str, Any]:
    """
    Retorna os resultados da análise completa.
    """
    try:
        # Busca a análise no banco de dados
        analysis = await PreAnalysisLog.find_one({"url": url})
        if not analysis:
            raise HTTPException(status_code=404, detail="Análise não encontrada")
            
        if analysis.status == "error":
            return {
                "status": "error",
                "error": analysis.error,
                "result": None
            }
            
        if analysis.status == "pending":
            return {
                "status": "pending",
                "message": "Análise em andamento"
            }
            
        return {
            "status": "completed",
            "result": analysis.result
        }
        
    except Exception as e:
        logger.error(f"Erro ao buscar resultados para URL {url}: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno ao buscar resultados") 