from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Query
from pydantic import BaseModel
from typing import Dict, Any
import logging
import traceback
from urllib.parse import urlparse, urlunparse
from ..models.pre_analysis_log import PreAnalysisLog
from ..services.analysis_service import analyze_property
from ..utils.pre_analysis_logger import save_pre_analysis_from_url
import pprint
import re
import requests
from fastapi.responses import Response

logger = logging.getLogger(__name__)
router = APIRouter()

class PreAnalysisRequest(BaseModel):
    url: str

def format_min_bid(value):
    if not value:
        return ""
    try:
        # Remove tudo que não for número ou vírgula
        value = re.sub(r"[^\d,]", "", value)
        # Troca vírgula por ponto para float
        value = value.replace(",", ".")
        return value
    except Exception:
        return ""

def mapToFrontend(raw):
    return {
        "title": raw.get("title") or raw.get("titulo") or "",
        "address": raw.get("address") or raw.get("endereco") or "",
        "city": raw.get("city") or raw.get("cidade") or "",
        "state": raw.get("state") or raw.get("estado") or "",
        "minBid": format_min_bid(raw.get("minBid") or raw.get("minimum_value") or raw.get("valor_minimo") or raw.get("lance") or ""),
        "evaluatedValue": raw.get("evaluated_value") or raw.get("evaluatedValue") or raw.get("valor_avaliado") or "",
        "propertyType": raw.get("property_type") or raw.get("propertyType") or "",
        "auctionType": raw.get("auctionType") or raw.get("tipoLeilao") or "Leilão",
        "auctionDate": raw.get("auction_date") or raw.get("data_leilao") or raw.get("auctionDate") or "",
        "description": raw.get("description") or raw.get("descricao") or raw.get("title") or "",
        "images": [raw.get("image") or raw.get("imagem") or raw.get("imageUrl")] if (raw.get("image") or raw.get("imagem") or raw.get("imageUrl")) else [],
        "documents": raw.get("documents", []),
        "auctions": raw.get("auctions", []),
        "extractionStatus": raw.get("extractionStatus") or "success"
    }

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
            raw = data.get("result") or data.get("data") or data
            mapped = mapToFrontend(raw)
            logger.info("[PRE-ANALYSIS] Dados enviados ao frontend: %s", pprint.pformat(mapped))
            return mapped
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

@router.post("/pre-analysis")
async def create_pre_analysis(request: PreAnalysisRequest, background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """
    Inicia uma nova pré-análise de uma propriedade em leilão.
    """
    url = request.url.strip()
    logger.info(f"Iniciando nova pré-análise para URL: {url}")
    if not url:
        raise HTTPException(status_code=400, detail="URL não pode ser vazia")
    # Verifica se já existe uma análise
    existing_analysis = await PreAnalysisLog.find_one({"url": url})
    if existing_analysis:
        logger.info(f"Pré-análise já existe para URL: {url}")
        data = existing_analysis.model_dump()
        data.pop("_id", None)
        data.pop("__v", None)
        raw = data.get("result") or data.get("data") or data
        mapped = mapToFrontend(raw)
        logger.info("[PRE-ANALYSIS] Dados enviados ao frontend: %s", pprint.pformat(mapped))
        return mapped
    # Cria um registro pendente
    await save_pre_analysis_from_url(url)
    # Inicia a análise em background
    background_tasks.add_task(analyze_property, url)
    return {
        "url": url,
        "status": "pending",
        "message": "Análise iniciada em background"
    }

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

@router.get("/pre-analysis")
async def get_pre_analysis_query(url: str = Query(..., description="URL da propriedade para análise")) -> Dict[str, Any]:
    """
    Obtém a pré-análise de uma propriedade em leilão via query param.
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
            raw = data.get("result") or data.get("data") or data
            mapped = mapToFrontend(raw)
            logger.info("[PRE-ANALYSIS] Dados enviados ao frontend: %s", pprint.pformat(mapped))
            return mapped
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

@router.get("/proxy-image")
async def proxy_image(url: str = Query(..., description="URL da imagem externa")):
    try:
        response = requests.get(url)
        content_type = response.headers.get("Content-Type", "image/jpeg")
        return Response(content=response.content, media_type=content_type)
    except Exception as e:
        logger.error(f"[PROXY ERROR] {e}")
        return Response(content=b"", status_code=500) 