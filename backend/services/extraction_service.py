import logging
from typing import Dict, Any
from .html_utils import get_html_content
from .extractors import (
    MegaLeiloesExtractor,
    ZukExtractor,
    extract_basic_data_from_html
)

logger = logging.getLogger(__name__)

async def extract_property_data(url: str) -> Dict[str, Any]:
    """
    Extrai dados de uma propriedade a partir da URL fornecida.
    Usa o extractor apropriado com base no domínio.
    """
    try:
        html = await get_html_content(url)
        if not html:
            return {
                "extractionStatus": "failed",
                "error": "Não foi possível obter o conteúdo HTML"
            }

        # Determina qual extractor usar
        if "megaleiloes.com.br" in url:
            extractor = MegaLeiloesExtractor(html)
        elif "portalzuk.com.br" in url:
            extractor = ZukExtractor(html)
        else:
            # Para outros domínios, usa extração básica
            return extract_basic_data_from_html(html, url)

        # Extrai os dados
        data = extractor.extract()
        
        # Adiciona a URL aos dados
        data["url"] = url
        
        return data

    except Exception as e:
        return {
            "extractionStatus": "failed",
            "error": str(e)
        } 