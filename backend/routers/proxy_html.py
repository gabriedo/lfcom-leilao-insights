from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import logging
from datetime import datetime
import os

logger = logging.getLogger(__name__)

router = APIRouter()

class ProxyHTMLRequest(BaseModel):
    url: str

class ProxyHTMLResponse(BaseModel):
    url: str
    html: str
    status: str
    message: str

@router.post("/proxy-html", response_model=ProxyHTMLResponse)
async def proxy_html(request: ProxyHTMLRequest):
    """
    Proxy para HTML que contorna restrições de CORS
    """
    try:
        url = request.url.strip()
        logger.info(f"Iniciando proxy de HTML para URL: {url}")

        if not url:
            raise HTTPException(status_code=400, detail="URL não pode ser vazia")

        # Headers para simular um navegador
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, follow_redirects=True)
            response.raise_for_status()
            html = response.text
            logger.info(f"HTML obtido com sucesso para: {url}")

            # Salva o HTML para depuração
            try:
                domain = url.split('/')[2].replace('.', '_')
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                os.makedirs('backend/html_samples', exist_ok=True)
                filename = f"backend/html_samples/{domain}_{timestamp}.html"
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(html)
                logger.info(f"HTML salvo em {filename}")
            except Exception as e:
                logger.warning(f"Não foi possível salvar o HTML: {e}")

            return ProxyHTMLResponse(
                url=url,
                html=html,
                status="success",
                message="HTML obtido com sucesso"
            )

    except httpx.HTTPError as e:
        logger.error(f"Erro HTTP ao buscar HTML: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao processar HTML: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao processar HTML") 