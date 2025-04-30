from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import httpx
from backend.routers import pre_analysis
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.models.url_log import URLLog
from .config import MongoDB
import asyncio
from datetime import datetime
import aiohttp
from bs4 import BeautifulSoup
import re
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI() 

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui as rotas do módulo pre_analysis
app.include_router(pre_analysis.router)

# Exemplo estático; depois podemos carregar do Mongo
AUTHORIZED_DOMAINS = ["innlei.org.br"]  # Adicione outros domínios conforme necessário

class UrlPayload(BaseModel):
    url: HttpUrl

@app.post("/validate-url")
async def validate_url(payload: UrlPayload):
    host = urlparse(str(payload.url)).hostname or ""
    if host not in AUTHORIZED_DOMAINS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error":"domain_not_allowed","domain":host}
        )
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.head(str(payload.url), follow_redirects=True)
    if resp.status_code >= 400:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error":"unreachable_url","status_code":resp.status_code}
        )
    return {"status":"ok"}

@app.on_event("startup")
async def startup_db_client():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    await MongoDB.connect_to_database(mongodb_url)

@app.on_event("shutdown")
async def shutdown_db_client():
    await MongoDB.close_database_connection()

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
        return {
            "url": url,
            "status": 500,
            "dominio": re.search(r'https?://([^/]+)', url).group(1),
            "timestamp": datetime.utcnow()
        }

@app.post("/check-urls/")
async def check_urls(urls: List[str]):
    tasks = [check_url(url) for url in urls]
    results = await asyncio.gather(*tasks)
    
    # Salvar resultados no MongoDB
    db = MongoDB.get_database()
    await db.url_logs.insert_many(results)
    
    return results

@app.get("/url-logs/")
async def get_url_logs(dominio: Optional[str] = None, limit: int = 100):
    db = MongoDB.get_database()
    query = {"dominio": dominio} if dominio else {}
    cursor = db.url_logs.find(query).sort("timestamp", -1).limit(limit)
    results = await cursor.to_list(length=limit)
    return results

@app.get("/dominios/")
async def get_dominios():
    db = MongoDB.get_database()
    dominios = await db.url_logs.distinct("dominio")
    return dominios 