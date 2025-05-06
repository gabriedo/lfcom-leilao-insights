import pytest
from unittest.mock import patch, MagicMock
from backend.services.extractors import extract_mega_data_from_url

def make_html(title='Mega', min_bid='R$ 300.000,00', property_type='Apartamento'):
    return f"""
    <html><head><title>{title}</title></head>
    <body>
        <div>Lance mínimo: {min_bid}</div>
        <div>Tipo: {property_type}</div>
    </body></html>
    """

def test_mega_extractor_without_fallback():
    url = 'https://www.megaleiloes.com.br/imovel/456'
    html = make_html()
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_mega_data') as mock_extract:
        mock_get.return_value.text = html
        mock_extract.return_value = {'title': 'Mega', 'minBid': '300000.00', 'propertyType': 'Apartamento'}
        mock_playwright.return_value = ''
        data = extract_mega_data_from_url(url)
        assert data['title'] == 'Mega'
        assert data['minBid'] == '300000.00'
        assert data['propertyType'] == 'Apartamento'
        assert data['extractionStatus'] == 'success'
        mock_playwright.assert_not_called()

def test_mega_extractor_with_fallback():
    url = 'https://www.megaleiloes.com.br/imovel/456'
    empty_html = ''
    valid_html = make_html('Mega2', 'R$ 400.000,00', 'Casa')
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_mega_data') as mock_extract:
        mock_get.return_value.text = empty_html
        mock_playwright.return_value = valid_html
        mock_extract.side_effect = [
            {'title': '', 'minBid': '', 'propertyType': ''},
            {'title': 'Mega2', 'minBid': '400000.00', 'propertyType': 'Casa'}
        ]
        data = extract_mega_data_from_url(url)
        assert data['title'] == 'Mega2'
        assert data['minBid'] == '400000.00'
        assert data['propertyType'] == 'Casa'
        assert data['extractionStatus'] == 'fallback_used'
        assert mock_playwright.call_count == 1

def test_mega_extractor_requests_failure():
    url = 'https://www.megaleiloes.com.br/imovel/456'
    with patch('backend.services.extractors.requests.get') as mock_get:
        mock_get.side_effect = Exception("Erro de conexão")
        data = extract_mega_data_from_url(url)
        assert isinstance(data, dict)
        assert data.get("title", "") == ""
        assert data['extractionStatus'] == 'failed'

def test_mega_extractor_playwright_failure():
    url = 'https://www.megaleiloes.com.br/imovel/456'
    empty_html = ''
    with patch('backend.services.extractors.requests.get') as mock_get, \
         patch('backend.services.extractors.render_with_playwright') as mock_playwright, \
         patch('backend.services.extractors.extract_mega_data') as mock_extract:
        mock_get.return_value.text = empty_html
        mock_playwright.side_effect = Exception("Erro ao renderizar")
        mock_extract.return_value = {'title': '', 'minBid': '', 'propertyType': ''}
        data = extract_mega_data_from_url(url)
        assert data['title'] == ''
        assert data['extractionStatus'] == 'failed' 