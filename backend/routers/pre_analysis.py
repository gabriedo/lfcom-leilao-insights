from fastapi import APIRouter, HTTPException, BackgroundTasks, Request, Query
from pydantic import BaseModel
from typing import Dict, Any, Tuple
import logging
import traceback
from urllib.parse import urlparse, urlunparse
from ..models.pre_analysis_log import PreAnalysisLog
from ..services.analysis_service import analyze_property
from ..utils.pre_analysis_logger import save_pre_analysis_from_url
import pprint
import re
import requests
from fastapi.responses import Response, StreamingResponse
from ..services import normalize_url
import httpx
import io
import locale

logger = logging.getLogger(__name__)
router = APIRouter()

# Configura locale para pt_BR
locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')

def validate_url(url: str) -> bool:
    """
    Valida se a URL é válida.
    Deve começar com http/https e conter domínio e path.
    """
    try:
        parsed = urlparse(url)
        return (
            parsed.scheme in ('http', 'https') and
            parsed.netloc and
            parsed.path
        )
    except Exception:
        return False

def normalize_monetary_value(value: str) -> str:
    """
    Normaliza valores monetários para o formato pt-BR.
    Exemplo: "48.634.11" -> "R$ 48.634,11"
    """
    if not value:
        return ""
    
    try:
        # Remove caracteres não numéricos exceto ponto e vírgula
        value = re.sub(r'[^\d.,]', '', value)
        
        # Se tiver dois pontos, assume que está invertido
        if value.count('.') > 1:
            # Remove todos os pontos
            value = value.replace('.', '')
            # Adiciona ponto para separar centavos
            value = value[:-2] + '.' + value[-2:]
        
        # Converte para float
        float_value = float(value.replace(',', '.'))
        
        # Formata com R$ e separadores pt-BR
        return f"R$ {float_value:,.2f}".replace(',', '_').replace('.', ',').replace('_', '.')
    except Exception as e:
        logger.error(f"Erro ao normalizar valor monetário '{value}': {str(e)}")
        return value

def extract_city_state_from_address(address: str) -> Tuple[str, str]:
    """
    Extrai cidade e estado de um endereço completo.
    Exemplo: "Avenida Caminho do Sol, 650, Parque do Sol, Olímpia, SP"
    Retorna: ("Olímpia", "SP")
    """
    if not address:
        return "", ""
    
    try:
        # Tenta o padrão principal
        match = re.search(r",\s*([\w\s]+),\s*([A-Z]{2})$", address)
        if match:
            city = match.group(1).strip()
            state = match.group(2).strip()
            logger.debug(f"Extraído cidade/estado: {city}/{state} de: {address}")
            return city, state
        
        # Fallback: pega os últimos dois elementos separados por vírgula
        parts = [p.strip() for p in address.split(',')]
        if len(parts) >= 2:
            city = parts[-2]
            state = parts[-1]
            logger.debug(f"Fallback: Extraído cidade/estado: {city}/{state} de: {address}")
            return city, state
        
        logger.warning(f"Cidade/Estado não extraídos de: {address}")
        return "", ""
    except Exception as e:
        logger.error(f"Erro ao extrair cidade/estado de '{address}': {str(e)}")
        return "", ""

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
    # Extrai cidade e estado do endereço
    address = raw.get("address") or raw.get("endereco") or ""
    city, state = extract_city_state_from_address(address)
    
    # Normaliza valores monetários
    min_bid = normalize_monetary_value(raw.get("minBid") or raw.get("minimum_value") or raw.get("valor_minimo") or raw.get("lance") or "")
    evaluated_value = normalize_monetary_value(raw.get("evaluated_value") or raw.get("evaluatedValue") or raw.get("valor_avaliado") or "")
    
    return {
        "title": raw.get("title") or raw.get("titulo") or "",
        "address": address,
        "city": city,
        "state": state,
        "minBid": min_bid,
        "evaluatedValue": evaluated_value,
        "propertyType": raw.get("property_type") or raw.get("propertyType") or "",
        "auctionType": raw.get("auctionType") or raw.get("tipoLeilao") or "Leilão",
        "auctionDate": raw.get("auction_date") or raw.get("data_leilao") or raw.get("auctionDate") or "",
        "description": raw.get("description") or raw.get("descricao") or raw.get("title") or "",
        "images": raw.get("images") if isinstance(raw.get("images"), list) and raw.get("images") else [
            raw.get("image") or raw.get("imagem") or raw.get("imageUrl")
        ] if (raw.get("image") or raw.get("imagem") or raw.get("imageUrl")) else [],
        "documents": raw.get("documents", []),
        "auctions": raw.get("auctions", []),
        "extractionStatus": raw.get("extractionStatus") or "success"
    }

@router.get("/pre-analysis/{url:path}")
async def get_pre_analysis(url: str, force: bool = False) -> Dict[str, Any]:
    """
    Obtém a pré-análise de uma propriedade em leilão.
    Se não existir, inicia uma nova análise em background.
    Se force=True, força nova análise e sobrescreve o cache.
    """
    try:
        normalized_url = normalize_url(url)
        logger.info(f"[PRE-ANALYSIS] URL recebida: {url}")
        logger.info(f"[PRE-ANALYSIS] URL normalizada: {normalized_url}")
        filtro = {"url": normalized_url}
        logger.info(f"[PRE-ANALYSIS] Filtro para find_one: {filtro}")
        if force:
            logger.info("[PRE-ANALYSIS] Forçando nova extração por parâmetro force=True")
            await save_pre_analysis_from_url(normalized_url)
            try:
                await analyze_property(normalized_url)
            except Exception as e:
                logger.error(f"[PRE-ANALYSIS] Erro ao executar analyze_property: {str(e)}\n{traceback.format_exc()}")
            analysis = await PreAnalysisLog.find_one(filtro)
            if analysis:
                data = analysis.model_dump()
                data.pop("_id", None)
                data.pop("__v", None)
                raw = data.get("result") or data.get("data") or data
                mapped = mapToFrontend(raw)
                logger.info("[PRE-ANALYSIS] Dados enviados ao frontend (force): %s", pprint.pformat(mapped))
                return mapped
            else:
                logger.error("[PRE-ANALYSIS] Nova extração falhou para URL: %s", normalized_url)
                return {"url": normalized_url, "status": "failed", "message": "Não foi possível extrair os dados."}
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
            # Verifica campos obrigatórios
            if not mapped.get("title") or not mapped.get("minBid") or not mapped.get("propertyType"):
                logger.warning("[RETRY] Dados incompletos detectados. Forçando nova extração...")
                logger.info("[PRE-ANALYSIS] Iniciando nova extração para URL: %s", normalized_url)
                await save_pre_analysis_from_url(normalized_url)
                try:
                    await analyze_property(normalized_url)
                except Exception as e:
                    logger.error(f"[PRE-ANALYSIS] Erro ao executar analyze_property: {str(e)}\n{traceback.format_exc()}")
                # Buscar novamente após extração
                analysis = await PreAnalysisLog.find_one(filtro)
                if analysis:
                    data = analysis.model_dump()
                    data.pop("_id", None)
                    data.pop("__v", None)
                    raw = data.get("result") or data.get("data") or data
                    mapped = mapToFrontend(raw)
                    logger.info("[PRE-ANALYSIS] Dados enviados ao frontend (nova extração): %s", pprint.pformat(mapped))
                    return mapped
                else:
                    logger.error("[PRE-ANALYSIS] Nova extração falhou para URL: %s", normalized_url)
                    return {"url": normalized_url, "status": "failed", "message": "Não foi possível extrair os dados."}
            else:
                logger.info("[PRE-ANALYSIS] Recuperado do banco")
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
async def get_pre_analysis_query(url: str = Query(..., description="URL da propriedade para análise"), force: bool = False) -> Dict[str, Any]:
    """
    Obtém a pré-análise de uma propriedade em leilão via query param.
    Se não existir, inicia uma nova análise em background.
    Se force=True, força nova análise e sobrescreve o cache.
    """
    try:
        # Validação inicial da URL
        if not validate_url(url):
            logger.error(f"[PRE-ANALYSIS] URL inválida recebida: {url}")
            raise HTTPException(
                status_code=400,
                detail="URL inválida. Deve começar com http/https e conter domínio e path."
            )

        normalized_url = normalize_url(url)
        logger.info(f"[PRE-ANALYSIS] URL recebida: {url}")
        logger.info(f"[PRE-ANALYSIS] URL normalizada: {normalized_url}")
        filtro = {"url": normalized_url}
        logger.info(f"[PRE-ANALYSIS] Filtro para find_one: {filtro}")
        if force:
            logger.info("[PRE-ANALYSIS] Forçando nova extração por parâmetro force=True")
            await save_pre_analysis_from_url(normalized_url)
            try:
                await analyze_property(normalized_url)
            except Exception as e:
                logger.error(f"[PRE-ANALYSIS] Erro ao executar analyze_property: {str(e)}\n{traceback.format_exc()}")
            analysis = await PreAnalysisLog.find_one(filtro)
            if analysis:
                data = analysis.model_dump()
                data.pop("_id", None)
                data.pop("__v", None)
                raw = data.get("result") or data.get("data") or data
                mapped = mapToFrontend(raw)
                logger.info("[PRE-ANALYSIS] Dados enviados ao frontend (force): %s", pprint.pformat(mapped))
                return mapped
            else:
                logger.error("[PRE-ANALYSIS] Nova extração falhou para URL: %s", normalized_url)
                return {"url": normalized_url, "status": "failed", "message": "Não foi possível extrair os dados."}
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
            # Verifica campos obrigatórios
            if not mapped.get("title") or not mapped.get("minBid") or not mapped.get("propertyType"):
                logger.warning("[RETRY] Dados incompletos detectados. Forçando nova extração...")
                logger.info("[PRE-ANALYSIS] Iniciando nova extração para URL: %s", normalized_url)
                await save_pre_analysis_from_url(normalized_url)
                try:
                    await analyze_property(normalized_url)
                except Exception as e:
                    logger.error(f"[PRE-ANALYSIS] Erro ao executar analyze_property: {str(e)}\n{traceback.format_exc()}")
                # Buscar novamente após extração
                analysis = await PreAnalysisLog.find_one(filtro)
                if analysis:
                    data = analysis.model_dump()
                    data.pop("_id", None)
                    data.pop("__v", None)
                    raw = data.get("result") or data.get("data") or data
                    mapped = mapToFrontend(raw)
                    logger.info("[PRE-ANALYSIS] Dados enviados ao frontend (nova extração): %s", pprint.pformat(mapped))
                    return mapped
                else:
                    logger.error("[PRE-ANALYSIS] Nova extração falhou para URL: %s", normalized_url)
                    return {"url": normalized_url, "status": "failed", "message": "Não foi possível extrair os dados."}
            else:
                logger.info("[PRE-ANALYSIS] Recuperado do banco")
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
async def proxy_image(url: str):
    """Proxy para imagens que resolve problemas de CORS."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=404, detail="Imagem não encontrada")
            
            return StreamingResponse(
                io.BytesIO(response.content),
                media_type=response.headers.get("content-type", "image/jpeg")
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/admin/pre-analysis-cache")
async def delete_pre_analysis_cache(url: str = Query(..., description="URL da propriedade para limpar cache")):
    """
    Endpoint ADMIN: Remove manualmente o cache de uma URL normalizada.
    """
    normalized_url = normalize_url(url)
    logger.info(f"[ADMIN] Deletando cache para URL normalizada: {normalized_url}")
    result = await PreAnalysisLog.find_one({"url": normalized_url})
    if not result:
        logger.warning(f"[ADMIN] Nenhum cache encontrado para URL: {normalized_url}")
        return {"status": "not_found", "url": normalized_url}
    await result.delete()
    logger.info(f"[ADMIN] Cache removido para URL: {normalized_url}")
    return {"status": "deleted", "url": normalized_url} 