import pytest
from unittest.mock import patch, MagicMock, AsyncMock
import json
import os
from bs4 import BeautifulSoup
from fastapi.testclient import TestClient
from main import app

# URLs de teste para diferentes domínios
TEST_URLS = [
    "https://www.sodresantoro.com.br/lote/123",  # Usando um domínio que está na lista de confiáveis
    "https://www.megaleiloes.com.br/lote/456",
    "https://www.leiloei.com.br/lote/789"
]

@pytest.mark.asyncio
async def test_pre_analyze_endpoint(client):
    """Testa o endpoint /pre-analyze com diferentes domínios"""
    # Mock da resposta HTTP
    mock_response = MagicMock()
    mock_response.text = """
    <html>
        <head>
            <title>Imóvel em Leilão - R$ 500.000,00</title>
        </head>
        <body>
            <h1>Casa em Condomínio - 3 Quartos</h1>
            <div class="price">Valor Mínimo: R$ 500.000,00</div>
            <img src="/images/property.jpg" alt="Imóvel">
            <div class="date">Data do Leilão: 2024-04-01</div>
        </body>
    </html>
    """
    mock_response.raise_for_status = MagicMock()

    with patch('requests.get', return_value=mock_response):
        for url in TEST_URLS:
            response = client.post(
                "/api/pre-analyze",
                json={"url": url}
            )
            
            # Verifica se a resposta tem status 200
            assert response.status_code == 200
            
            # Verifica a estrutura da resposta
            data = response.json()
            assert "valido" in data
            assert "site" in data
            
            # Se o domínio for válido, verifica os campos obrigatórios
            if data["valido"]:
                assert "titulo" in data
                assert "valor_minimo" in data
                assert "imagem" in data
                assert "data_leilao" in data
                
                # Verifica se pelo menos o título foi extraído
                assert data["titulo"] is not None
                
                # Log dos dados extraídos para análise
                print(f"\nDados extraídos para {url}:")
                print(json.dumps(data, indent=2, ensure_ascii=False))

@pytest.mark.asyncio
async def test_extract_basic_data_from_html():
    """Testa a função extract_basic_data_from_html diretamente"""
    from routers.pre_analysis import extract_basic_data_from_html
    
    # HTML de exemplo para teste
    test_html = """
    <html>
        <head>
            <title>Imóvel em Leilão - R$ 500.000,00</title>
        </head>
        <body>
            <h1>Casa em Condomínio - 3 Quartos</h1>
            <div class="price">Valor Mínimo: R$ 500.000,00</div>
            <img src="/images/property.jpg" alt="Imóvel">
            <div class="date">Data do Leilão: 2024-04-01</div>
        </body>
    </html>
    """
    
    result = await extract_basic_data_from_html(test_html, "https://test.com")
    
    # Verifica se todos os campos foram extraídos
    assert "titulo" in result
    assert "valor_minimo" in result
    assert "imagem" in result
    assert "data_leilao" in result
    
    # Verifica os valores específicos
    assert result["titulo"] == "Casa em Condomínio - 3 Quartos"
    assert result["valor_minimo"] == "R$ 500.000,00"
    assert result["imagem"] == "https://test.com/images/property.jpg"
    assert result["data_leilao"] == "2024-04-01"

@pytest.mark.asyncio
async def test_log_persistence(client):
    """Testa se os logs estão sendo salvos no MongoDB"""
    from models.url_log import URLLog
    from config import MongoDB
    
    # Mock da resposta HTTP
    mock_response = MagicMock()
    mock_response.text = """
    <html>
        <head>
            <title>Imóvel em Leilão - R$ 500.000,00</title>
        </head>
        <body>
            <h1>Casa em Condomínio - 3 Quartos</h1>
            <div class="price">Valor Mínimo: R$ 500.000,00</div>
            <img src="/images/property.jpg" alt="Imóvel">
            <div class="date">Data do Leilão: 2024-04-01</div>
        </body>
    </html>
    """
    mock_response.raise_for_status = MagicMock()

    # Mock do banco de dados
    mock_collection = AsyncMock()
    mock_collection.insert_one = AsyncMock()
    mock_collection.find_one = AsyncMock(return_value={
        "url": TEST_URLS[0],
        "status": "confiável",
        "dominio": "sodresantoro.com.br",
        "dados_extraidos": {
            "titulo": "Casa em Condomínio - 3 Quartos",
            "valor_minimo": "R$ 500.000,00",
            "imagem": "https://test.com/images/property.jpg",
            "data_leilao": "2024-04-01"
        }
    })

    mock_db = MagicMock()
    mock_db.url_logs = mock_collection

    with patch('requests.get', return_value=mock_response), \
         patch('config.MongoDB.get_database', return_value=mock_db):
        
        # Faz uma requisição para o endpoint
        response = client.post(
            "/api/pre-analyze",
            json={"url": TEST_URLS[0]}
        )
        
        # Verifica se a resposta tem status 200
        assert response.status_code == 200
        
        # Verifica se o log foi salvo no banco
        assert mock_collection.insert_one.called
        
        # Verifica a estrutura do log
        call_args = mock_collection.insert_one.call_args
        assert call_args is not None
        log_data = call_args[0][0]  # Primeiro argumento da primeira chamada
        
        assert "url" in log_data
        assert "dominio" in log_data
        assert "status" in log_data
        assert log_data["status"] == "confiável" 