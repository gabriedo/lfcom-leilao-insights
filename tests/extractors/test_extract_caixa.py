import pytest
from unittest.mock import patch, MagicMock
from backend.services.extractors import extract_caixa_data_from_url

def make_html(title='Caixa', min_bid='R$ 500.000,00', property_type='Casa'):
    return f"""
    <html><head><title>{title}</title></head>
    <body>
        <div>Lance mínimo: {min_bid}</div>
        <div>Tipo: {property_type}</div>
    </body></html>
    """

def test_caixa_extractor_without_fallback():
    url = 'https://www.leiloes.caixa.gov.br/imovel/789'
    html = make_html()
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_caixa_data') as mock_extract:
        mock_get.return_value.text = html
        mock_extract.return_value = {'title': 'Caixa', 'minBid': '500000.00', 'propertyType': 'Casa'}
        mock_playwright.return_value = ''
        data = extract_caixa_data_from_url(url)
        assert data['title'] == 'Caixa'
        assert data['minBid'] == '500000.00'
        assert data['propertyType'] == 'Casa'
        assert data['extractionStatus'] == 'success'
        mock_playwright.assert_not_called()

def test_caixa_extractor_with_fallback():
    url = 'https://www.leiloes.caixa.gov.br/imovel/789'
    empty_html = ''
    valid_html = make_html('Caixa2', 'R$ 600.000,00', 'Apartamento')
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_caixa_data') as mock_extract:
        mock_get.return_value.text = empty_html
        mock_playwright.return_value = valid_html
        mock_extract.side_effect = [
            {'title': '', 'minBid': '', 'propertyType': ''},
            {'title': 'Caixa2', 'minBid': '600000.00', 'propertyType': 'Apartamento'}
        ]
        data = extract_caixa_data_from_url(url)
        assert data['title'] == 'Caixa2'
        assert data['minBid'] == '600000.00'
        assert data['propertyType'] == 'Apartamento'
        assert data['extractionStatus'] == 'fallback_used'
        assert mock_playwright.call_count == 1

def test_caixa_extractor_requests_failure():
    url = 'https://www.leiloes.caixa.gov.br/imovel/789'
    with patch('backend.services.extractors.requests.get') as mock_get:
        mock_get.side_effect = Exception("Erro de conexão")
        data = extract_caixa_data_from_url(url)
        assert isinstance(data, dict)
        assert data.get("title", "") == ""
        assert data['extractionStatus'] == 'failed'

def test_caixa_extractor_playwright_failure():
    url = 'https://www.leiloes.caixa.gov.br/imovel/789'
    empty_html = ''
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_caixa_data') as mock_extract:
        mock_get.return_value.text = empty_html
        mock_playwright.side_effect = Exception("Erro ao renderizar")
        mock_extract.return_value = {'title': '', 'minBid': '', 'propertyType': ''}
        data = extract_caixa_data_from_url(url)
        assert data['title'] == ''
        assert data['extractionStatus'] == 'failed' 