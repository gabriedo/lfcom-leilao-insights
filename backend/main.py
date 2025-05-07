import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi import FastAPI, HTTPException, status, Request
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import httpx
from backend.routers import pre_analysis, extraction_report, proxy
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from backend.models.url_log import URLLog
from backend.config import MongoDB, check_port_in_use, kill_process_on_port, connect_to_mongodb, close_mongodb_connection
import asyncio
from datetime import datetime
import aiohttp
from bs4 import BeautifulSoup
import re
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import logging
import pathlib
from backend.services.analysis_service import analyze_property

# Carrega variáveis de ambiente
load_dotenv()

# Configuração de logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.getenv("LOG_FILE", "app.log")),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Leilão Insights API",
    description="API para análise de propriedades em leilão",
    version="1.0.0"
)

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os routers
app.include_router(pre_analysis.router, prefix="/api/v1", tags=["pre-analysis"])
app.include_router(extraction_report.router, prefix="/api/v1", tags=["extraction-report"])
app.include_router(proxy.router, prefix="/api/v1", tags=["proxy"])

# Exemplo estático; depois podemos carregar do Mongo
AUTHORIZED_DOMAINS = ["innlei.org.br"]  # Adicione outros domínios conforme necessário

class UrlPayload(BaseModel):
    url: HttpUrl

class ExtractionCallback(BaseModel):
    url: str
    titulo: Optional[str] = None
    valor_minimo: Optional[str] = None
    imagem: Optional[str] = None
    data_leilao: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    auction_type: Optional[str] = None
    evaluated_value: Optional[str] = None
    address: Optional[str] = None
    documents: Optional[List[Dict[str, str]]] = None
    images: Optional[List[str]] = None

@app.post("/api/extraction-callback")
async def extraction_callback(data: ExtractionCallback):
    try:
        logger.info(f"Recebendo callback para URL: {data.url}")
        logger.debug(f"Dados recebidos: {data.dict()}")
        
        # Adiciona timestamp
        result = {
            **data.dict(),
            "timestamp": datetime.utcnow()
        }
        
        # Salva no MongoDB
        db = MongoDB.get_database()
        collection = db.extraction_results
        await collection.insert_one(result)
        logger.info(f"Dados salvos com sucesso para URL: {data.url}")
        
        return {"success": True, "message": "Dados recebidos e salvos com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao processar callback: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-url")
async def validate_url(payload: UrlPayload):
    try:
        host = urlparse(str(payload.url)).hostname or ""
        if host not in AUTHORIZED_DOMAINS:
            logger.warning(f"Domínio não autorizado: {host}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error":"domain_not_allowed","domain":host}
            )
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.head(str(payload.url), follow_redirects=True)
        if resp.status_code >= 400:
            logger.warning(f"URL inacessível: {payload.url} (status: {resp.status_code})")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error":"unreachable_url","status_code":resp.status_code}
            )
        return {"status":"ok"}
    except Exception as e:
        logger.error(f"Erro ao validar URL: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """
    Evento executado na inicialização da aplicação.
    """
    try:
        logger.info("Iniciando conexão com MongoDB...")
        await MongoDB.connect()
        logger.info("Aplicação iniciada com sucesso")
    except Exception as e:
        logger.error(f"Erro ao iniciar aplicação: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """
    Evento executado no encerramento da aplicação.
    """
    try:
        logger.info("Fechando conexão com MongoDB...")
        await MongoDB.close()
        logger.info("Aplicação encerrada com sucesso")
    except Exception as e:
        logger.error(f"Erro ao encerrar aplicação: {str(e)}")
        raise

async def check_url(url: str) -> dict:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                status = response.status
                dominio = re.search(r'https?://([^/]+)', url).group(1)
                return {
                    "url": url,
                    "status": status,
                    "dominio": dominio,
                    "timestamp": datetime.utcnow()
                }
    except Exception as e:
        logger.error(f"Erro ao verificar URL {url}: {str(e)}", exc_info=True)
        return {
            "url": url,
            "status": 500,
            "dominio": re.search(r'https?://([^/]+)', url).group(1),
            "timestamp": datetime.utcnow()
        }

@app.post("/check-urls/")
async def check_urls(urls: List[str]):
    try:
        tasks = [check_url(url) for url in urls]
        results = await asyncio.gather(*tasks)
        
        # Salvar resultados no MongoDB
        db = MongoDB.get_database()
        await db.url_logs.insert_many(results)
        
        return results
    except Exception as e:
        logger.error(f"Erro ao verificar URLs: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/url-logs/")
async def get_url_logs(dominio: Optional[str] = None, limit: int = 100):
    try:
        db = MongoDB.get_database()
        query = {"dominio": dominio} if dominio else {}
        cursor = db.url_logs.find(query).sort("timestamp", -1).limit(limit)
        results = await cursor.to_list(length=limit)
        return results
    except Exception as e:
        logger.error(f"Erro ao buscar logs de URL: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/dominios/")
async def get_dominios():
    try:
        db = MongoDB.get_database()
        dominios = await db.url_logs.distinct("dominio")
        return dominios
    except Exception as e:
        logger.error(f"Erro ao buscar domínios: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/extraction-results/{url:path}")
async def get_extraction_results(url: str):
    try:
        db = MongoDB.get_database()
        result = await db.extraction_results.find_one({"url": url})
        if not result:
            raise HTTPException(status_code=404, detail="Resultado não encontrado")
        return result
    except Exception as e:
        logger.error(f"Erro ao buscar resultados para URL {url}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """
    Endpoint raiz para verificar se a API está funcionando.
    """
    return {
        "message": "Leilão Insights API",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/health")
async def health_check():
    """
    Endpoint para verificar a saúde da API e suas dependências.
    """
    try:
        # Verifica conexão com MongoDB
        db = MongoDB.get_database()
        if not db:
            raise Exception("Database not initialized")
            
        # Tenta uma operação simples
        await db.command("ping")
        
        return {
            "status": "healthy",
            "database": "connected",
            "version": "1.0.0"
        }
        
    except Exception as e:
        logger.error(f"Erro no health check: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )

class PropertyRequest(BaseModel):
    url: HttpUrl

@app.post("/analyze")
async def analyze_property_endpoint(request: PropertyRequest) -> Dict[str, Any]:
    """
    Analisa uma propriedade a partir da URL fornecida.
    """
    try:
        logger.info(f"Recebida requisição para analisar: {request.url}")
        result = analyze_property(str(request.url))
        
        if result.get('status') == 'error':
            raise HTTPException(status_code=500, detail=result.get('error', 'Erro desconhecido'))
            
        return result
        
    except Exception as e:
        logger.error(f"Erro ao processar requisição: {e}")
        raise HTTPException(status_code=500, detail=str(e)) 