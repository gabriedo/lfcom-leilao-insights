import logging
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Dict, Any, Optional
import re
from datetime import datetime
from .html_utils import get_html_content, render_with_playwright
import requests

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
}

def extract_sodre_data(soup: BeautifulSoup, url: str) -> Dict[str, Any]:
    """
    Extrai dados específicos do site Sodré Santoro.
    """
    try:
        # Título
        titulo = None
        titulo_element = soup.find('h1', class_='product-title')
        if titulo_element:
            titulo = titulo_element.text.strip()
        
        # Valor mínimo
        valor_minimo = None
        valor_element = soup.find('div', class_='product-price')
        if valor_element:
            valor_text = valor_element.text.strip()
            valor_match = re.search(r'R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?', valor_text)
            if valor_match:
                valor_minimo = valor_match.group(0)
        
        # Imagem
        imagem = None
        imagem_element = soup.find('div', class_='product-gallery').find('img') if soup.find('div', class_='product-gallery') else None
        if imagem_element and imagem_element.get('src'):
            imagem = urljoin(url, imagem_element['src'])
        
        # Data do leilão
        data_leilao = None
        data_element = soup.find('div', class_='auction-date')
        if data_element:
            data_text = data_element.text.strip()
            data_match = re.search(r'\d{2}/\d{2}/\d{4}', data_text)
            if data_match:
                try:
                    date_obj = datetime.strptime(data_match.group(0), '%d/%m/%Y')
                    data_leilao = date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    pass
        
        return {
            "titulo": titulo,
            "valor_minimo": valor_minimo,
            "imagem": imagem,
            "data_leilao": data_leilao
        }
    except Exception as e:
        logger.error(f"Erro ao extrair dados do Sodré: {str(e)}")
        raise

def extract_zuk_data(html: str) -> Dict[str, Any]:
    """Extrai dados específicos do Portal Zuk."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        data = {}
        
        # Título
        title_elem = soup.find('h1', class_='property-title')
        if title_elem:
            data['title'] = title_elem.text.strip()
        
        # Valor mínimo
        price_elem = soup.find('div', class_='property-price')
        if price_elem:
            price_text = price_elem.text.strip()
            price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
            if price_match:
                data['minimum_value'] = price_match.group(1)
        
        # Imagem
        image_elem = soup.find('img', class_='property-image')
        if image_elem and image_elem.get('src'):
            data['image'] = image_elem['src']
        
        # Data do leilão
        date_elem = soup.find('div', class_='auction-date')
        if date_elem:
            date_text = date_elem.text.strip()
            date_match = re.search(r'\d{2}/\d{2}/\d{4}', date_text)
            if date_match:
                try:
                    data['auction_date'] = datetime.strptime(date_match.group(0), '%d/%m/%Y').isoformat()
                except Exception as e:
                    logger.warning(f"Erro ao converter data do leilão Zuk: {e}")
        
        # Endereço
        address_elem = soup.find('div', class_='property-address')
        if address_elem:
            address_text = address_elem.text.strip()
            location_match = re.search(r'([^,]+),\s*([^,]+),\s*([A-Z]{2})', address_text)
            if location_match:
                data['address'] = location_match.group(1).strip()
                data['city'] = location_match.group(2).strip()
                data['state'] = location_match.group(3).strip()
        
        return data
    except Exception as e:
        logger.error(f"Erro ao extrair dados do Zuk: {e}")
        return {}

def determine_extraction_status(data: dict, fallback_used: bool) -> str:
    """
    Determina o status da extração baseado nos campos essenciais e uso de fallback.
    
    Args:
        data: Dicionário com os dados extraídos
        fallback_used: Se o Playwright foi usado como fallback
        
    Returns:
        str: Status da extração (success, fallback_used, partial, failed)
    """
    essential_fields = ['title', 'minBid', 'propertyType']
    missing_fields = [field for field in essential_fields if not data.get(field)]
    
    if not missing_fields:
        return "fallback_used" if fallback_used else "success"
    elif len(missing_fields) < len(essential_fields):
        return "partial"
    else:
        return "failed"

def extract_zuk_data_from_url(url: str) -> dict:
    html = requests.get(url, headers=HEADERS, timeout=10).text
    data = extract_zuk_data(html)
    fallback_used = False
    
    if is_data_incomplete(data):
        fallback_used = True
        html = render_with_playwright(url)
        data = extract_zuk_data(html)
    
    data['extractionStatus'] = determine_extraction_status(data, fallback_used)
    missing_fields = [field for field in ['title', 'minBid', 'propertyType'] if not data.get(field)]
    log_extraction_event(url, data['extractionStatus'], missing_fields)
    return data

def extract_mega_data(html: str) -> Dict[str, Any]:
    """Extrai dados específicos do Mega Leilões."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        data = {}
        
        # Título
        title_elem = soup.find('h1', class_='property-title')
        if title_elem:
            data['title'] = title_elem.text.strip()
        
        # Valor mínimo
        price_elem = soup.find('div', class_='property-price')
        if price_elem:
            price_text = price_elem.text.strip()
            price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
            if price_match:
                data['minimum_value'] = price_match.group(1)
        
        # Imagem
        image_elem = soup.find('img', class_='property-image')
        if image_elem and image_elem.get('src'):
            data['image'] = image_elem['src']
        
        # Data do leilão
        date_elem = soup.find('div', class_='auction-date')
        if date_elem:
            date_text = date_elem.text.strip()
            date_match = re.search(r'\d{2}/\d{2}/\d{4}', date_text)
            if date_match:
                try:
                    data['auction_date'] = datetime.strptime(date_match.group(0), '%d/%m/%Y').isoformat()
                except Exception as e:
                    logger.warning(f"Erro ao converter data do leilão Mega: {e}")
        
        # Endereço
        address_elem = soup.find('div', class_='property-address')
        if address_elem:
            address_text = address_elem.text.strip()
            location_match = re.search(r'([^,]+),\s*([^,]+),\s*([A-Z]{2})', address_text)
            if location_match:
                data['address'] = location_match.group(1).strip()
                data['city'] = location_match.group(2).strip()
                data['state'] = location_match.group(3).strip()
        
        return data
    except Exception as e:
        logger.error(f"Erro ao extrair dados do Mega: {e}")
        return {}

def extract_mega_data_from_url(url: str) -> dict:
    html = requests.get(url, headers=HEADERS, timeout=10).text
    data = extract_mega_data(html)
    fallback_used = False
    
    if is_data_incomplete(data):
        fallback_used = True
        html = render_with_playwright(url)
        data = extract_mega_data(html)
    
    data['extractionStatus'] = determine_extraction_status(data, fallback_used)
    missing_fields = [field for field in ['title', 'minBid', 'propertyType'] if not data.get(field)]
    log_extraction_event(url, data['extractionStatus'], missing_fields)
    return data

def extract_caixa_data(html: str) -> Dict[str, Any]:
    """Extrai dados específicos do site da Caixa."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        data = {}
        
        # Título
        title_elem = soup.find('h1', class_='property-title')
        if title_elem:
            data['title'] = title_elem.text.strip()
        
        # Valor mínimo
        price_elem = soup.find('div', class_='property-price')
        if price_elem:
            price_text = price_elem.text.strip()
            price_match = re.search(r'R\$\s*([\d.,]+)', price_text)
            if price_match:
                data['minimum_value'] = price_match.group(1)
        
        # Imagem
        image_elem = soup.find('img', class_='property-image')
        if image_elem and image_elem.get('src'):
            data['image'] = image_elem['src']
        
        # Data do leilão
        date_elem = soup.find('div', class_='auction-date')
        if date_elem:
            date_text = date_elem.text.strip()
            date_match = re.search(r'\d{2}/\d{2}/\d{4}', date_text)
            if date_match:
                try:
                    data['auction_date'] = datetime.strptime(date_match.group(0), '%d/%m/%Y').isoformat()
                except Exception as e:
                    logger.warning(f"Erro ao converter data do leilão Caixa: {e}")
        
        # Endereço
        address_elem = soup.find('div', class_='property-address')
        if address_elem:
            address_text = address_elem.text.strip()
            location_match = re.search(r'([^,]+),\s*([^,]+),\s*([A-Z]{2})', address_text)
            if location_match:
                data['address'] = location_match.group(1).strip()
                data['city'] = location_match.group(2).strip()
                data['state'] = location_match.group(3).strip()
        
        return data
    except Exception as e:
        logger.error(f"Erro ao extrair dados da Caixa: {e}")
        return {}

def extract_caixa_data_from_url(url: str) -> dict:
    html = requests.get(url, headers=HEADERS, timeout=10).text
    data = extract_caixa_data(html)
    fallback_used = False
    
    if is_data_incomplete(data):
        fallback_used = True
        html = render_with_playwright(url)
        data = extract_caixa_data(html)
    
    data['extractionStatus'] = determine_extraction_status(data, fallback_used)
    missing_fields = [field for field in ['title', 'minBid', 'propertyType'] if not data.get(field)]
    log_extraction_event(url, data['extractionStatus'], missing_fields)
    return data

def extract_basic_data_from_html(html: str, url: str) -> Dict[str, Any]:
    """Extrai dados básicos do HTML da página"""
    if not html:
        logger.error("HTML vazio recebido para extração")
        return {}
        
    try:
        soup = BeautifulSoup(html, 'html.parser')
        domain = urlparse(url).netloc
        
        logger.info(f"Iniciando extração de dados para domínio: {domain}")
        
        # Extrair dados específicos por domínio
        if 'portalzuk.com.br' in domain:
            data = extract_zuk_data(html)
        elif 'megaleiloes.com.br' in domain:
            data = extract_mega_data(html)
        elif 'venda-imoveis.caixa.gov.br' in domain:
            data = extract_caixa_data(html)
        else:
            logger.warning(f"Domínio não suportado: {domain}")
            data = {}
            
        # Validar campos obrigatórios
        missing_fields = []
        required_fields = ['title', 'minBid', 'propertyType', 'images']
        for field in required_fields:
            if not data.get(field):
                missing_fields.append(field)
                
        if missing_fields:
            logger.warning(f"Campos faltando: {', '.join(missing_fields)}")
            
        return data
        
    except Exception as e:
        logger.error(f"Erro ao extrair dados do HTML: {str(e)}")
        return {}

def extract_generic_data(soup: BeautifulSoup, url: str) -> Dict[str, Any]:
    """
    Extrai dados básicos de forma genérica para domínios não reconhecidos.
    """
    try:
        # Título
        titulo = None
        titulo_candidates = [
            soup.find('h1'),
            soup.find('meta', property='og:title'),
            soup.find('title')
        ]
        
        for candidate in titulo_candidates:
            if candidate:
                if candidate.name == 'meta':
                    titulo = candidate.get('content', '').strip()
                else:
                    titulo = candidate.text.strip()
                if titulo:
                    break
        
        # Valor mínimo
        valor_minimo = None
        for element in soup.find_all(['div', 'span', 'p']):
            if element.text and 'R$' in element.text:
                valor_match = re.search(r'R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?', element.text)
                if valor_match:
                    valor_minimo = valor_match.group(0)
                    break
        
        # Imagem
        imagem = None
        imagem_candidates = [
            soup.find('meta', property='og:image'),
            soup.find('img', class_=lambda x: x and ('principal' in x.lower() or 'main' in x.lower()))
        ]
        
        for candidate in imagem_candidates:
            if candidate:
                if candidate.name == 'meta':
                    imagem = candidate.get('content')
                else:
                    imagem = candidate.get('src')
                if imagem:
                    imagem = urljoin(url, imagem)
                    break
        
        # Data do leilão
        data_leilao = None
        for element in soup.find_all(['div', 'span', 'p']):
            if element.text:
                data_match = re.search(r'\d{2}/\d{2}/\d{4}', element.text)
                if data_match:
                    try:
                        date_obj = datetime.strptime(data_match.group(0), '%d/%m/%Y')
                        data_leilao = date_obj.strftime('%Y-%m-%d')
                        break
                    except ValueError:
                        continue

        # Endereço
        endereco = None
        endereco_candidates = [
            soup.find('div', class_=lambda x: x and ('endereco' in x.lower() or 'address' in x.lower())),
            soup.find('span', class_=lambda x: x and ('endereco' in x.lower() or 'address' in x.lower()))
        ]
        
        for candidate in endereco_candidates:
            if candidate:
                endereco = candidate.text.strip()
                break

        # Cidade e Estado
        cidade = None
        estado = None
        for element in soup.find_all(['div', 'span', 'p']):
            if element.text:
                cidade_estado_match = re.search(r'([^/]+)/([A-Z]{2})', element.text)
                if cidade_estado_match:
                    cidade = cidade_estado_match.group(1).strip()
                    estado = cidade_estado_match.group(2).strip()
                    break
        
        return {
            "titulo": titulo,
            "valor_minimo": valor_minimo,
            "imagem": imagem,
            "data_leilao": data_leilao,
            "endereco": endereco,
            "cidade": cidade,
            "estado": estado
        }
    except Exception as e:
        logger.error(f"Erro ao extrair dados genéricos: {str(e)}")
        raise 

def is_data_incomplete(data: dict) -> bool:
    return not data.get("title") or not data.get("minBid") or not data.get("propertyType") 