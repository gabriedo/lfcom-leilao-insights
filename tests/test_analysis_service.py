import pytest
from unittest.mock import patch, MagicMock
from bs4 import BeautifulSoup
from services.analysis_service import analyze_property, extract_basic_data

@pytest.fixture
def mock_response():
    html = """
    <html>
        <head>
            <title>Imóvel em Leilão - Casa 3 Quartos</title>
            <meta property="og:title" content="Casa 3 Quartos em Leilão">
            <meta property="og:image" content="https://exemplo.com/imagem.jpg">
        </head>
        <body>
            <h1>Casa 3 Quartos em Leilão</h1>
            <div class="valor">Valor Mínimo: R$ 500.000,00</div>
            <div class="data">Data do Leilão: 01/03/2024</div>
            <img src="/imagem.jpg" alt="Imóvel">
        </body>
    </html>
    """
    response = MagicMock()
    response.text = html
    return response

@pytest.mark.asyncio
async def test_analyze_property_success(mock_response):
    with patch('requests.get', return_value=mock_response), \
         patch('services.analysis_service.save_pre_analysis') as mock_save:
        
        url = "https://exemplo.com/imovel"
        await analyze_property(url)
        
        mock_save.assert_called_once()
        call_args = mock_save.call_args[1]
        assert call_args['url'] == url
        assert call_args['status'] == "completed"
        assert call_args['error'] is None
        assert call_args['result'] is not None

@pytest.mark.asyncio
async def test_analyze_property_request_error():
    with patch('requests.get', side_effect=Exception("Erro de conexão")), \
         patch('services.analysis_service.save_pre_analysis') as mock_save:
        
        url = "https://exemplo.com/imovel"
        await analyze_property(url)
        
        mock_save.assert_called_once()
        call_args = mock_save.call_args[1]
        assert call_args['url'] == url
        assert call_args['status'] == "error"
        assert "Erro ao acessar URL" in call_args['error']
        assert call_args['result'] is None

def test_extract_basic_data(mock_response):
    soup = BeautifulSoup(mock_response.text, 'html.parser')
    url = "https://exemplo.com/imovel"
    
    result = extract_basic_data(mock_response.text, url)
    
    assert result['titulo'] == "Casa 3 Quartos em Leilão"
    assert result['valor_minimo'] == "R$ 500.000,00"
    assert result['imagem'] == "https://exemplo.com/imagem.jpg"
    assert result['data_leilao'] == "2024-03-01"

def test_extract_value_minimo():
    from services.analysis_service import extract_value_minimo
    
    # Teste com diferentes formatos de valor
    assert extract_value_minimo("R$ 500.000,00") == "R$ 500.000,00"
    assert extract_value_minimo("Valor: R$ 1.000.000,00") == "R$ 1.000.000,00"
    assert extract_value_minimo("Preço R$ 100,00") == "R$ 100,00"
    assert extract_value_minimo("Sem valor") is None

def test_extract_data_leilao():
    from services.analysis_service import extract_data_leilao
    
    # Teste com diferentes formatos de data
    assert extract_data_leilao("01/03/2024") == "2024-03-01"
    assert extract_data_leilao("Data: 2024-03-01") == "2024-03-01"
    assert extract_data_leilao("Sem data") is None 