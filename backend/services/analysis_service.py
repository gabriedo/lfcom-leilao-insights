import logging
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any
from .extractors import extract_basic_data_from_html
from ..utils.pre_analysis_logger import save_pre_analysis

logger = logging.getLogger(__name__)

async def analyze_property(url: str) -> Dict[str, Any]:
    """
    Analisa uma propriedade em leilão a partir da URL fornecida.
    """
    try:
        logger.info(f"Iniciando análise da propriedade: {url}")
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
            # Extrai dados básicos usando os extratores específicos
            basic_data = extract_basic_data_from_html(html, url)
            logger.info(f"Dados básicos extraídos com sucesso para: {url}")
            # Salva o resultado da pré-análise
            await save_pre_analysis(url, basic_data)
            logger.info(f"Pré-análise salva com sucesso para: {url}")
            return basic_data
    except httpx.HTTPError as e:
        error_msg = f"Erro HTTP ao acessar {url}: {str(e)}"
        logger.error(error_msg)
        await save_pre_analysis(url, None, error_msg)
        raise
    except Exception as e:
        error_msg = f"Erro ao analisar propriedade {url}: {str(e)}"
        logger.error(error_msg)
        await save_pre_analysis(url, None, error_msg)
        raise 