from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import httpx
from routers import pre_analysis

app = FastAPI()

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