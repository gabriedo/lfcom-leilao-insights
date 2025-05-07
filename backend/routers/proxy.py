from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/proxy-image")
async def proxy_image(url: str):
    """
    Proxy para imagens que contorna restrições de CORS.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Erro ao buscar imagem")
            
            return StreamingResponse(
                response.iter_bytes(),
                media_type=response.headers.get("content-type", "image/jpeg")
            )
    except Exception as e:
        logger.error(f"Erro ao buscar imagem: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro ao processar imagem") 