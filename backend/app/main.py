from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.api_v1.api import api_router

app = FastAPI(
    title="Leilão Insights API",
    description="API para análise e monitoramento de leilões do B3",
    version="1.0.0",
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão das rotas da API
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API do Leilão Insights",
        "version": "1.0.0",
        "docs_url": "/docs",
    } 