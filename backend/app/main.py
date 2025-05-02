from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.api_v1.api import api_router
from routers.pre_analysis import router as pre_analysis_router
from utils.logger import setup_logging

app = FastAPI(
    title="Leilão Insights API",
    description="API para análise e monitoramento de leilões do B3",
    version="1.0.0",
)

setup_logging()

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
app.include_router(pre_analysis_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Bem-vindo à API do Leilão Insights",
        "version": "1.0.0",
        "docs_url": "/docs",
    } 

# ✅ /pre-analyze funcional: scraping, validação, logging no MongoDB e resposta formatada OK.
# 🔧 Melhorias pendentes sugeridas:
# - Adicionar mais domínios confiáveis no leiloeiros.json
# - Suporte a outros sites além do Sodré Santoro
# - Mais campos: endereço, área, tipo de imóvel
# - Implementar métricas de uso e performance