import pytest
import httpx
from bs4 import BeautifulSoup
from services.extractors import extract_basic_data_from_html
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@pytest.mark.asyncio
@pytest.mark.parametrize("url", [
    "https://www.portalzuk.com.br/imovel/sp/sao-paulo/jardim-monte-kemel/rua-david-ben-gurion-955/32919-201914",
    "https://www.megaleiloes.com.br/imoveis/hoteis/sp/olimpia/fracao-ideal-sobre-apartamento-comercial-61-m2-apart-hotel-no-solar-das-aguas-park-resort-parque-do-sol-olimpia-sp-j109665",
    "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=1555531017715"
])
async def test_extraction(url):
    """
    Testa a extração de dados de uma URL específica.
    """
    try:
        logger.info(f"Testando extração para: {url}")
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
            data = extract_basic_data_from_html(html, url)
            logger.info("Resultados da extração:")
            for key, value in data.items():
                logger.info(f"{key}: {value}")
            assert data is not None
    except Exception as e:
        logger.error(f"Erro ao testar extração para {url}: {str(e)}")
        raise

if __name__ == "__main__":
    pytest.main() 