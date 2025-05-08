from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/proxy-image")
async def proxy_image(url: str):
    """
    Proxy para imagens que contorna restrições de CORS
    """
    try:
        logger.info(f"Iniciando proxy de imagem para URL: {url}")

        if not url:
            raise HTTPException(status_code=400, detail="URL não pode ser vazia")

        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                logger.error(f"Erro ao buscar imagem: {response.status_code}")
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar imagem")
            
            logger.info(f"Imagem obtida com sucesso: {url}")
            return StreamingResponse(
                response.iter_bytes(),
                media_type=response.headers.get("content-type", "image/jpeg")
            )

    except httpx.HTTPError as e:
        logger.error(f"Erro HTTP ao buscar imagem: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Erro ao processar imagem: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao processar imagem") 