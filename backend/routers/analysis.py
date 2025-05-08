from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
import logging
from ..models import Property, PreAnalysisLog
from ..services.analysis_service import analyze_property

logger = logging.getLogger(__name__)

router = APIRouter()

class AnalysisRequest(BaseModel):
    url: str

class AnalysisResponse(BaseModel):
    url: str
    status: str
    message: str

@router.post("/analysis", response_model=AnalysisResponse)
async def create_analysis(request: AnalysisRequest, background_tasks: BackgroundTasks):
    """
    Inicia uma nova análise de uma propriedade em leilão
    """
    try:
        url = request.url.strip()
        logger.info(f"Iniciando nova análise para URL: {url}")

        if not url:
            raise HTTPException(status_code=400, detail="URL não pode ser vazia")

        # Verifica se já existe uma análise
        existing_property = await Property.find_one({"url": url})
        if existing_property:
            logger.info(f"Propriedade já analisada: {url}")
            return AnalysisResponse(
                url=url,
                status="completed",
                message="Análise já existe"
            )

        # Cria um registro pendente
        log = PreAnalysisLog(
            url=url,
            status="pending"
        )
        await log.save()

        # Inicia a análise em background
        background_tasks.add_task(analyze_property, url)

        return AnalysisResponse(
            url=url,
            status="pending",
            message="Análise iniciada em background"
        )

    except Exception as e:
        logger.error(f"Erro ao iniciar análise: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analysis/{url:path}")
async def get_analysis(url: str):
    """
    Obtém o resultado de uma análise
    """
    try:
        logger.info(f"Buscando análise para URL: {url}")

        # Busca a propriedade
        property = await Property.find_one({"url": url})
        if property:
            logger.info(f"Propriedade encontrada: {url}")
            return property.model_dump()

        # Busca o log
        log = await PreAnalysisLog.find_one({"url": url})
        if log:
            logger.info(f"Log encontrado: {url}")
            return {
                "url": url,
                "status": log.status,
                "result": log.result.model_dump() if log.result else None,
                "error": log.error
            }

        raise HTTPException(status_code=404, detail="Análise não encontrada")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao buscar análise: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 