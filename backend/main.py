from fastapi import FastAPI, HTTPException, status, Request
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import httpx
from backend.routers import pre_analysis
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from backend.models.url_log import URLLog
from backend.config import MongoDB
import asyncio
from datetime import datetime
import aiohttp
from bs4 import BeautifulSoup
import re
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv
import logging
import sys

# Configuração de logging mais detalhada
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('app.log')
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(
    title="LFCom Leilão Insights API",
    description="API para análise de imóveis em leilão",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os routers
app.include_router(pre_analysis.router, prefix="/api", tags=["analysis"])

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
        if not db:
            logger.error("Database não inicializado")
            raise HTTPException(status_code=500, detail="Database não inicializado")
            
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
async def startup_db_client():
    try:
        logger.info("Iniciando conexão com MongoDB...")
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        mongodb_db = os.getenv("MONGODB_DB", "leilao_insights")
        logger.debug(f"MongoDB URL: {mongodb_url}")
        logger.debug(f"MongoDB Database: {mongodb_db}")
        
        await MongoDB.connect_to_database(mongodb_url)
        logger.info("Conexão com MongoDB estabelecida com sucesso!")
    except Exception as e:
        logger.error(f"Erro ao conectar com MongoDB: {str(e)}", exc_info=True)
        raise

@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        logger.info("Fechando conexão com MongoDB...")
        await MongoDB.close_database_connection()
        logger.info("Conexão com MongoDB fechada com sucesso!")
    except Exception as e:
        logger.error(f"Erro ao fechar conexão com MongoDB: {str(e)}", exc_info=True)
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
        logger.info(f"Buscando resultados para URL: {url}")
        
        db = MongoDB.get_database()
        if not db:
            logger.error("Database não inicializado")
            raise HTTPException(status_code=500, detail="Database não inicializado")
            
        collection = db.extraction_results
        
        # Busca o resultado mais recente para a URL
        result = await collection.find_one(
            {"url": url},
            sort=[("timestamp", -1)]
        )
        
        if not result:
            logger.info(f"Nenhum resultado encontrado para URL: {url}")
            return {"success": False, "message": "Nenhum resultado encontrado"}
            
        # Remove o _id do resultado
        result.pop("_id", None)
        logger.info(f"Resultado encontrado: {result}")
        
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"Erro ao buscar resultados: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "LFCom Leilão Insights API"} 