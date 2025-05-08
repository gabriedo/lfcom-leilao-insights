import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
import pytest
from unittest.mock import AsyncMock, patch
from backend.services import extraction_service

@pytest.fixture
def mock_html_content():
    async def _mock(*args, **kwargs):
        return '''<html><body>
            <h1>Imóvel Comercial Rio do Pires</h1>
            <div class='price'>R$ 100.000,00</div>
            <span class='type'>Comercial</span>
            <p class='address'>Rua Teste, 123 - São Paulo/SP</p>
            <p class='city'>Rio do Pires</p>
            <p class='state'>BA</p>
            <p class='auction-date'>01/01/2024</p>
            <img src='img1.jpg'/><img src='img2.jpg'/>
        </body></html>'''
    return _mock

@pytest.mark.asyncio
async def test_extract_property_data_mega_leiloes(mock_html_content):
    """Testa a extração de dados do Mega Leilões"""
    url = "https://www.megaleiloes.com.br/imovel/12345"
    with patch("backend.services.extraction_service.get_html_content", new=mock_html_content):
        data = await extraction_service.extract_property_data(url)
    assert data["extractionStatus"] == "success"
    assert data["title"] == "Imóvel Comercial Rio do Pires"
    assert "100.000" in str(data["minBid"])
    assert data["propertyType"] == "Comercial"
    assert "Rio do Pires" in data["city"]
    assert data["state"] == "BA"
    assert len(data["images"]) == 2
    assert data["url"] == url

@pytest.mark.asyncio
async def test_extract_property_data_zuk(mock_html_content):
    """Testa a extração de dados do Portal Zuk"""
    url = "https://portalzuk.com.br/imovel/12345"
    with patch("backend.services.extraction_service.get_html_content", new=mock_html_content):
        data = await extraction_service.extract_property_data(url)
    assert data["extractionStatus"] == "success"
    assert data["title"] == "Imóvel Comercial Rio do Pires"
    assert "100.000" in str(data["minBid"])
    assert data["propertyType"] == "Comercial"
    assert "Rio do Pires" in data["city"]
    assert data["state"] == "BA"
    assert len(data["images"]) == 2
    assert data["url"] == url

@pytest.mark.asyncio
async def test_extract_property_data_unsupported(mock_html_content):
    """Testa a extração de dados de um portal não suportado"""
    url = "https://example.com/imovel/12345"
    with patch("backend.services.extraction_service.get_html_content", new=mock_html_content):
        data = await extraction_service.extract_property_data(url)
    assert data["extractionStatus"] == "success"
    assert isinstance(data["title"], str)
    assert isinstance(data["minBid"], (str, float, int))
    assert isinstance(data["images"], list)
    assert data["url"] == url

@pytest.mark.asyncio
async def test_extract_property_data_error():
    """Testa o tratamento de erro na extração de dados"""
    url = "https://www.megaleiloes.com.br/imovel/12345"
    
    async def mock_error(*args):
        raise Exception("Erro ao obter HTML")
    
    with patch("backend.services.extraction_service.get_html_content", new=mock_error):
        data = await extraction_service.extract_property_data(url)
    
    assert data["extractionStatus"] == "failed"
    assert "error" in data
    assert data.get("url", url) == url 