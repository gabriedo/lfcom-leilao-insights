import logging
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Dict, Any, Optional
import re
from datetime import datetime
from .html_utils import get_html_content, render_with_playwright
import requests
import time
from urllib.parse import parse_qs
from playwright.sync_api import sync_playwright
import httpx

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

def extract_mega_data(html: str) -> dict:
    """Extrai dados de uma página da Mega Leilões."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Extrair título
        title = None
        title_element = soup.select_one('h1.title')
        if title_element:
            title = title_element.get_text().strip()
            logger.info(f"[MEGA] Título encontrado: {title}")
        
        # Extrair lance mínimo
        min_bid = None
        min_bid_element = soup.select_one('div.price')
        if min_bid_element:
            price_text = min_bid_element.get_text().strip()
            if price_text:
                # Remover R$ e converter para float
                price_text = price_text.replace('R$', '').replace('.', '').replace(',', '.').strip()
                try:
                    min_bid = float(price_text)
                    logger.info(f"[MEGA] Lance mínimo encontrado: {min_bid}")
                except ValueError:
                    logger.warning(f"[MEGA] Erro ao converter lance mínimo: {price_text}")
        
        # Extrair tipo do imóvel
        property_type = None
        type_element = soup.select_one('div.property-type')
        if type_element:
            property_type = type_element.get_text().strip()
            logger.info(f"[MEGA] Tipo de imóvel encontrado: {property_type}")
        
        # Extrair endereço
        address = None
        address_element = soup.select_one('div.address')
        if address_element:
            address = address_element.get_text().strip()
            logger.info(f"[MEGA] Endereço encontrado: {address}")
        
        # Extrair cidade e estado
        city = None
        state = None
        location_element = soup.select_one('div.location')
        if location_element:
            text = location_element.get_text().strip()
            if text:
                # Tenta extrair cidade e estado do texto
                state_match = re.search(r'([A-Z]{2})(?:\s|$)', text)
                if state_match:
                    state = state_match.group(1)
                    # Tenta extrair a cidade antes do estado
                    city_match = re.search(r'([^,]+),\s*' + state, text)
                    if city_match:
                        city = city_match.group(1).strip()
                        logger.info(f"[MEGA] Cidade/Estado encontrados: {city}/{state}")
        
        # Extrair imagens (robusto)
        images = []
        seen = set()
        # 1. <img src="...">
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if '/batches/' in src:
                if not src.startswith('http'):
                    src = 'https://www.megaleiloes.com.br' + src
                if src not in seen:
                    images.append(src)
                    seen.add(src)
            # 2. <img data-mfp-src="...">
            data_mfp = img.get('data-mfp-src', '')
            if '/batches/' in data_mfp:
                if not data_mfp.startswith('http'):
                    data_mfp = 'https://www.megaleiloes.com.br' + data_mfp
                if data_mfp not in seen:
                    images.append(data_mfp)
                    seen.add(data_mfp)
        # 3. <meta property="og:image" ...>
        for meta in soup.find_all('meta', property='og:image'):
            content = meta.get('content', '')
            if '/batches/' in content and content not in seen:
                images.append(content)
                seen.add(content)
        # 4. <meta property="og:image:secure_url" ...>
        for meta in soup.find_all('meta', property='og:image:secure_url'):
            content = meta.get('content', '')
            if '/batches/' in content and content not in seen:
                images.append(content)
                seen.add(content)
        logger.info(f"[MEGA] Total de imagens extraídas: {len(images)}")
        
        # Validar campos obrigatórios
        missing_fields = []
        if not title:
            missing_fields.append('title')
        if not min_bid:
            missing_fields.append('minBid')
        if not property_type:
            missing_fields.append('propertyType')
        
        if missing_fields:
            logger.warning(f"[MEGA] Campos obrigatórios faltando: {', '.join(missing_fields)}")
        
        return {
            'title': title or '',
            'minBid': f"{min_bid:.2f}" if min_bid else '',
            'propertyType': property_type or '',
            'address': address or '',
            'city': city or '',
            'state': state or '',
            'images': images,
            'extractionStatus': 'success' if not missing_fields else 'incomplete'
        }
    except Exception as e:
        logger.error(f"[MEGA] Erro ao extrair dados: {e}")
        return {
            'title': '',
            'minBid': '',
            'propertyType': '',
            'address': '',
            'city': '',
            'state': '',
            'images': [],
            'extractionStatus': 'failed',
            'error': str(e)
        }

def extract_mega_data_from_url(url: str) -> dict:
    """Extrai dados do Mega Leilões a partir da URL."""
    try:
        # Normalizar URL removendo parâmetros de tracking
        parsed_url = urlparse(url)
        path = parsed_url.path
        if '?' in url:
            # Manter apenas o parâmetro x (ID do imóvel)
            query_params = parse_qs(parsed_url.query)
            if 'x' in query_params:
                path = f"{path}?x={query_params['x'][0]}"
        
        normalized_url = f"{parsed_url.scheme}://{parsed_url.netloc}{path}"
        
        # Primeira tentativa com requests
        html = requests.get(normalized_url, headers=HEADERS, timeout=10).text
        data = extract_mega_data(html)
        fallback_used = False
        
        # Se os dados estiverem incompletos, tenta com Playwright
        if is_data_incomplete(data):
            fallback_used = True
            html = render_with_playwright(normalized_url)
            data = extract_mega_data(html)
        
        # Se ainda estiver incompleto, tenta com a URL original
        if is_data_incomplete(data):
            html = requests.get(url, headers=HEADERS, timeout=10).text
            data = extract_mega_data(html)
        
        # Adiciona status da extração
        data['extractionStatus'] = determine_extraction_status(data, fallback_used)
        
        # Log dos campos faltantes
        missing_fields = [field for field in ['title', 'minBid', 'propertyType'] if not data.get(field)]
        if missing_fields:
            logger.warning(f"Campos faltando na extração do Mega: {', '.join(missing_fields)}")
        
        log_extraction_event(normalized_url, data['extractionStatus'], missing_fields)
        return data
    except Exception as e:
        logger.error(f"Erro ao extrair dados do Mega Leilões: {e}")
        return {
            'title': '',
            'minBid': '',
            'propertyType': '',
            'address': '',
            'city': '',
            'state': '',
            'images': [],
            'extractionStatus': 'failed'
        }

def extract_caixa_data(html: str) -> Dict[str, Any]:
    """Extrai dados da Caixa a partir do HTML."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        logger.info(f"[CAIXA] Tamanho do HTML: {len(html)} | Trecho: {html[:300]}")
        # Título - tenta diferentes seletores
        title = None
        title_selectors = [
            'h5[style*="font-size: 18px"]',
            'h5[style*="font-size:18px"]',
            'h5[style*="font-weight: bold"]',
            'h5[style*="color: #006bae"]',
            'h5.property-title',
            'h5.title',
            'title'
        ]
        for selector in title_selectors:
            element = soup.select_one(selector)
            logger.info(f"[CAIXA] Buscando título com selector '{selector}': {'OK' if element else 'NÃO ENCONTRADO'}")
            if element:
                title = element.get_text().strip()
                if title:
                    break
        # Lance mínimo - tenta diferentes seletores
        min_bid = None
        min_bid_selectors = [
            'p[style*="font-size: 18px"]',
            'p[style*="font-size:18px"]',
            'p[style*="font-weight: bold"]',
            'div.property-price',
            'div.price',
            'span[style*="font-size: 14px"]',
            'span[style*="font-size:14px"]'
        ]
        for selector in min_bid_selectors:
            element = soup.select_one(selector)
            logger.info(f"[CAIXA] Buscando minBid com selector '{selector}': {'OK' if element else 'NÃO ENCONTRADO'}")
            if element:
                text = element.get_text().strip()
                match = re.search(r'R\$\s*([\d.,]+)', text)
                logger.info(f"[CAIXA] Regex minBid: {'OK' if match else 'NÃO ENCONTRADO'}")
                if match:
                    min_bid = match.group(1).replace('.', '').replace(',', '.')
                    break
        # Tipo do imóvel - tenta diferentes seletores
        property_type = None
        property_type_selectors = [
            'span[style*="font-size: 14px"]',
            'span[style*="font-size:14px"]',
            'div.property-type',
            'div.type'
        ]
        for selector in property_type_selectors:
            element = soup.select_one(selector)
            logger.info(f"[CAIXA] Buscando propertyType com selector '{selector}': {'OK' if element else 'NÃO ENCONTRADO'}")
            if element:
                text = element.get_text().strip()
                if 'Apartamento' in text:
                    property_type = 'Apartamento'
                elif 'Casa' in text:
                    property_type = 'Casa'
                elif 'Comercial' in text:
                    property_type = 'Comercial'
                elif 'Terreno' in text:
                    property_type = 'Terreno'
                if property_type:
                    break
        if not property_type and title:
            title_lower = title.lower()
            if 'apartamento' in title_lower:
                property_type = 'Apartamento'
            elif 'casa' in title_lower:
                property_type = 'Casa'
            elif 'comercial' in title_lower:
                property_type = 'Comercial'
            elif 'terreno' in title_lower:
                property_type = 'Terreno'
        # Endereço
        address = None
        address_selectors = [
            'span[style*="font-size: 14px"]',
            'span[style*="font-size:14px"]',
            'div.property-address',
            'div.address'
        ]
        for selector in address_selectors:
            element = soup.select_one(selector)
            logger.info(f"[CAIXA] Buscando address com selector '{selector}': {'OK' if element else 'NÃO ENCONTRADO'}")
            if element:
                text = element.get_text().strip()
                if text and not text.startswith('R$'):
                    address = text
                    break
        # Cidade e Estado
        city = None
        state = None
        location_selectors = [
            'span[style*="font-size: 14px"]',
            'span[style*="font-size:14px"]',
            'div.property-location',
            'div.location'
        ]
        for selector in location_selectors:
            element = soup.select_one(selector)
            logger.info(f"[CAIXA] Buscando city/state com selector '{selector}': {'OK' if element else 'NÃO ENCONTRADO'}")
            if element:
                text = element.get_text().strip()
                location_match = re.search(r'([^-]+)\s*-\s*([A-Z]{2})', text)
                logger.info(f"[CAIXA] Regex city/state: {'OK' if location_match else 'NÃO ENCONTRADO'}")
                if location_match:
                    city = location_match.group(1).strip()
                    state = location_match.group(2).strip()
                    break
        # Imagens
        images = []
        image_selectors = [
            'img[src*="/fotos/"]',
            'div.gallery img',
            'div.property-gallery img'
        ]
        for selector in image_selectors:
            elements = soup.select(selector)
            logger.info(f"[CAIXA] Buscando images com selector '{selector}': {len(elements)} encontrados")
            for element in elements:
                image_url = element.get('src', '')
                if image_url:
                    if not image_url.startswith('http'):
                        image_url = f"https://venda-imoveis.caixa.gov.br{image_url}"
                    images.append(image_url)
            if images:
                break
        # Log dos campos encontrados
        logger.info(f"[CAIXA] Campos extraídos:")
        logger.info(f"Título: {title}")
        logger.info(f"Lance mínimo: {min_bid}")
        logger.info(f"Tipo: {property_type}")
        logger.info(f"Endereço: {address}")
        logger.info(f"Cidade: {city}")
        logger.info(f"Estado: {state}")
        logger.info(f"Imagens: {len(images)}")
        # Validação dos campos obrigatórios
        if not title or not min_bid or not property_type:
            logger.warning(f"[CAIXA] Campos obrigatórios faltando: title={not title}, minBid={not min_bid}, propertyType={not property_type}")
            return {
                'title': title or '',
                'minBid': min_bid or '',
                'propertyType': property_type or '',
                'address': address or '',
                'city': city or '',
                'state': state or '',
                'images': images,
                'extractionStatus': 'failed',
                'error': 'Não foi possível extrair os dados da Caixa.'
            }
        return {
            'title': title or '',
            'minBid': min_bid or '',
            'propertyType': property_type or '',
            'address': address or '',
            'city': city or '',
            'state': state or '',
            'images': images,
            'extractionStatus': 'success'
        }
    except Exception as e:
        logger.error(f"Erro ao extrair dados da Caixa: {e}")
        return {
            'title': '',
            'minBid': '',
            'propertyType': '',
            'address': '',
            'city': '',
            'state': '',
            'images': [],
            'extractionStatus': 'failed',
            'error': str(e)
        }

def extract_caixa_data_from_url(url: str) -> dict:
    """Extrai dados de uma URL da Caixa."""
    try:
        logger.info(f"[CAIXA] Iniciando extração para URL: {url}")
        
        # Preserva a URL original com todos os parâmetros
        original_url = url
        
        # Faz a requisição HTTP
        response = httpx.get(original_url, follow_redirects=True)
        response.raise_for_status()
        
        # Salva o HTML para debug
        html = response.text
        logger.info(f"[CAIXA] HTML obtido com sucesso. Tamanho: {len(html)}")
        
        # Extrai os dados
        data = extract_caixa_data(html)
        
        # Adiciona a URL original aos dados
        data['url'] = original_url
        
        # Log dos dados extraídos
        logger.info(f"[CAIXA] Dados extraídos: {data}")
        
        return data
    except Exception as e:
        logger.error(f"[CAIXA] Erro ao extrair dados: {str(e)}")
        return {
            'url': url,
            'title': None,
            'minBid': None,
            'propertyType': None,
            'address': None,
            'city': None,
            'state': None,
            'images': [],
            'description': None,
            'auctionDate': None,
            'auctionType': 'Leilão',
            'auctions': [],
            'documents': [],
            'evaluatedValue': None,
            'extractionStatus': 'error',
            'error': str(e)
        }

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
        required_fields = ['title', 'minBid', 'propertyType']
        missing_fields = [field for field in required_fields if not data.get(field)]
        # Ajustar extractionStatus
        if not missing_fields:
            data['extractionStatus'] = 'success'
        elif len(missing_fields) < len(required_fields):
            data['extractionStatus'] = 'partial'
        else:
            data['extractionStatus'] = 'failed'
        data['missingFields'] = missing_fields
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

def normalize_url(url: str) -> str:
    """Normaliza a URL para uso interno, preservando query params para a Caixa."""
    if "venda-imoveis.caixa.gov.br" in url:
        return url  # mantém completa
    # comportamento atual para os demais
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}" 