import logging
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Dict, Any, Optional, List, Tuple
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

def clean_currency_value(value: str) -> str:
    """
    Limpa e formata um valor monetário, removendo caracteres especiais
    e garantindo o formato correto com 2 casas decimais.
    """
    if not value:
        return ""
        
    try:
        # Remove caracteres não numéricos exceto ponto e vírgula
        value = re.sub(r'[^\d.,]', '', value)
        
        # Se houver múltiplos pontos ou vírgulas, mantém apenas o último
        if value.count('.') > 1 or value.count(',') > 1:
            parts = re.split(r'[.,]', value)
            if len(parts) > 1:
                value = ''.join(parts[:-1]) + '.' + parts[-1]
        
        # Converte vírgula para ponto se necessário
        value = value.replace(',', '.')
        
        # Converte para float e formata com 2 casas decimais
        float_value = float(value)
        
        # Se o valor for maior que 1000, adiciona separador de milhar
        if float_value >= 1000:
            return f"{float_value:,.2f}".replace(',', '_').replace('.', ',').replace('_', '.')
        else:
            return f"{float_value:.2f}".replace('.', ',')
            
    except (ValueError, AttributeError):
        return value

def extract_property_type(soup: BeautifulSoup, title: str) -> Optional[str]:
    """
    Extrai o tipo de propriedade do HTML.
    
    Args:
        soup: Objeto BeautifulSoup com o HTML
        title: Título da propriedade
        
    Returns:
        String com o tipo de propriedade ou None se não encontrado
    """
    # Primeiro tenta encontrar no título
    if title:
        title_lower = title.lower()
        if 'apartamento' in title_lower:
            if 'comercial' in title_lower:
                return 'Apartamento Comercial'
            return 'Apartamento'
        elif 'casa' in title_lower:
            return 'Casa'
        elif 'comercial' in title_lower:
            return 'Comercial'
        elif 'terreno' in title_lower:
            return 'Terreno'
        elif 'hotel' in title_lower:
            return 'Hotel'
        elif 'fração' in title_lower:
            return 'Fração Ideal'
    
    # Se não encontrou no título, procura em outros elementos
    property_type_selectors = [
        'div.property-type',
        'div.type',
        'span.property-type',
        'span.type'
    ]
    
    for selector in property_type_selectors:
        element = soup.select_one(selector)
        if element:
            text = element.text.strip().lower()
            if 'apartamento' in text:
                if 'comercial' in text:
                    return 'Apartamento Comercial'
                return 'Apartamento'
            elif 'casa' in text:
                return 'Casa'
            elif 'comercial' in text:
                return 'Comercial'
            elif 'terreno' in text:
                return 'Terreno'
            elif 'hotel' in text:
                return 'Hotel'
            elif 'fração' in text:
                return 'Fração Ideal'
    
    return None

def extract_min_bid(soup: BeautifulSoup) -> str:
    """
    Extrai o valor mínimo do lance com múltiplos seletores e fallback.
    """
    selectors = [
        "span[data-testid='min-bid-value']",
        "div[class*='min-bid']",
        "div[class*='valor-minimo']",
        "span[class*='valor-minimo']",
        "div[class*='lance-minimo']",
        "span[class*='lance-minimo']"
    ]
    
    for selector in selectors:
        element = soup.select_one(selector)
        if element:
            value = element.get_text(strip=True)
            if value:
                return clean_currency_value(value)
    
    # Fallback: procura por padrões comuns de valores monetários
    text = soup.get_text()
    money_patterns = [
        r'R\$\s*(\d+[.,]\d{2})',
        r'Valor\s*Mínimo:\s*R\$\s*(\d+[.,]\d{2})',
        r'Lance\s*Mínimo:\s*R\$\s*(\d+[.,]\d{2})'
    ]
    
    for pattern in money_patterns:
        match = re.search(pattern, text)
        if match:
            return clean_currency_value(match.group(1))
    
    return ""

def validate_extraction_status(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Valida o status da extração e campos obrigatórios.
    """
    required_fields = ['title', 'minBid', 'propertyType']
    missing_fields = [field for field in required_fields if not data.get(field)]
    
    # Se todos os campos obrigatórios estiverem presentes
    if not missing_fields:
        data['extractionStatus'] = 'success'
        data['missingFields'] = []
    # Se alguns campos estiverem presentes
    elif len(missing_fields) < len(required_fields):
        data['extractionStatus'] = 'partial'
        data['missingFields'] = missing_fields
    # Se nenhum campo obrigatório estiver presente
    else:
        data['extractionStatus'] = 'failed'
        data['missingFields'] = missing_fields
    
    return data

def extract_images(soup: BeautifulSoup) -> List[str]:
    """
    Extrai URLs das imagens do imóvel, filtrando apenas imagens relevantes.
    """
    images = []
    
    # Procura por imagens em diferentes seletores
    selectors = [
        'div.owl-carousel img',
        'div.gallery img',
        'div.property-images img',
        'div[class*="carousel"] img',
        'div[class*="gallery"] img'
    ]
    
    for selector in selectors:
        for img in soup.select(selector):
            src = img.get('data-mfp-src') or img.get('src')
            if not src:
                continue
                
            # Ignora imagens de ícones e logos
            if any(ext in src.lower() for ext in ['.svg', '.png', 'logo', 'icon']):
                continue
                
            # Prefere imagens de alta resolução
            if '1024x768' in src or '670x380' in src:
                # Remove parâmetros de URL desnecessários
                clean_url = src.split('?')[0]
                if clean_url not in images:
                    images.append(clean_url)
    
    # Remove duplicatas mantendo a ordem
    return list(dict.fromkeys(images))

def extract_title(soup: BeautifulSoup) -> str:
    """
    Extrai o título do imóvel do HTML.
    
    Args:
        soup: Objeto BeautifulSoup com o HTML
        
    Returns:
        String com o título do imóvel ou string vazia se não encontrado
    """
    # Tenta diferentes seletores para o título
    title_selectors = [
        'h1[class*="title"]',
        'h1[class*="property"]',
        'div[class*="title"] h1',
        'div[class*="property"] h1',
        'h1'
    ]
    
    for selector in title_selectors:
        element = soup.select_one(selector)
        if element:
            title = element.get_text(strip=True)
            if title:
                return title
    
    # Se não encontrou com seletores, tenta encontrar no título da página
    title_tag = soup.find('title')
    if title_tag:
        title = title_tag.get_text(strip=True)
        # Remove sufixos comuns do título da página
        title = re.sub(r'\s*[-|]\s*Mega Leilões.*$', '', title)
        if title:
            return title
    
    return ""

def extract_city_state_from_address(address: str) -> Tuple[str, str]:
    """
    Extrai cidade e estado de um endereço completo.
    Exemplo: "Rua Exemplo, 123, Vila Madalena, São Paulo, SP" -> ("São Paulo", "SP")
    """
    if not address:
        return "", ""
    
    try:
        # Procura por padrão de cidade e estado no final do endereço
        match = re.search(r",\s*([^,]+),\s*([A-Z]{2})$", address)
        if match:
            city, state = match.groups()
            return city.strip(), state.strip()
        
        # Fallback: tenta pegar os dois últimos elementos separados por vírgula
        parts = [p.strip() for p in address.split(",")]
        if len(parts) >= 2:
            city = parts[-2]
            state = parts[-1]
            if re.match(r"^[A-Z]{2}$", state):
                return city, state
        
        return "", ""
    except Exception as e:
        logger.error(f"[MEGA][DEBUG] Erro ao extrair cidade/estado: {str(e)}")
        return "", ""

def extract_document_count(soup: BeautifulSoup) -> int:
    """
    Extrai o número de documentos disponíveis.
    """
    try:
        # Procura por elementos que contenham a palavra "documento"
        doc_elements = soup.find_all(string=re.compile(r'documento', re.IGNORECASE))
        for element in doc_elements:
            # Procura por números próximos à palavra "documento"
            match = re.search(r'(\d+)\s*documento', element, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return 0
    except Exception as e:
        logger.error(f"Erro ao extrair contagem de documentos: {e}")
        return 0

def extract_bid_count(soup: BeautifulSoup) -> int:
    """
    Extrai o número de lances registrados.
    """
    try:
        # Procura por elementos que contenham a palavra "lance"
        bid_elements = soup.find_all(string=re.compile(r'lance', re.IGNORECASE))
        for element in bid_elements:
            # Procura por números próximos à palavra "lance"
            match = re.search(r'(\d+)\s*lance', element, re.IGNORECASE)
            if match:
                return int(match.group(1))
        return 0
    except Exception as e:
        logger.error(f"Erro ao extrair contagem de lances: {e}")
        return 0

def extract_mega_data(html_content: str, url: str) -> Dict[str, Any]:
    """
    Extrai dados de imóveis do Mega Leilões.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    logger.info(f"[MEGA][DEBUG] Tamanho do HTML recebido: {len(html_content)}")
    
    # Extrai dados básicos
    title = extract_title(soup)
    property_type = extract_property_type(soup, title)
    min_bid = extract_min_bid(soup)
    images = extract_images(soup)
    address = extract_address(soup)
    
    # Extrai cidade e estado do endereço
    city, state = extract_city_state_from_address(address)
    
    # Extrai contagem de documentos e lances
    doc_count = extract_document_count(soup)
    bid_count = extract_bid_count(soup)
    
    # Logs para debug
    if title:
        logger.info(f"[MEGA][INFO] Título encontrado: {title}")
    if property_type:
        logger.info(f"[MEGA][INFO] Tipo de imóvel encontrado: {property_type}")
    if min_bid:
        logger.info(f"[MEGA][INFO] Valor mínimo encontrado: {min_bid}")
    if images:
        logger.info(f"[MEGA][DEBUG] images encontrados: {len(images)} -> {images}")
    if city or state:
        logger.info(f"[MEGA][INFO] Localização encontrada: {city}/{state}")
    if doc_count > 0:
        logger.info(f"[MEGA][INFO] Documentos encontrados: {doc_count}")
    if bid_count > 0:
        logger.info(f"[MEGA][INFO] Lances encontrados: {bid_count}")
    
    # Monta o objeto de retorno
    data = {
        'title': title or '',
        'propertyType': property_type or '',
        'minBid': min_bid or '',
        'images': images or [],
        'address': address or '',
        'city': city or '',
        'state': state or '',
        'description': extract_description(soup) or '',
        'auctionType': 'Leilão',
        'auctionDate': extract_auction_date(soup) or '',
        'evaluatedValue': extract_evaluated_value(soup) or '',
        'documents': extract_documents(soup) or [],
        'auctions': extract_auctions(soup) or [],
        'documentCount': doc_count,
        'bidCount': bid_count
    }
    
    # Valida o status da extração
    data = validate_extraction_status(data)
    
    return data

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
        data = extract_mega_data(html, normalized_url)
        fallback_used = False
        
        # Se os dados estiverem incompletos, tenta com Playwright
        if is_data_incomplete(data):
            fallback_used = True
            html = render_with_playwright(normalized_url)
            data = extract_mega_data(html, normalized_url)
        
        # Se ainda estiver incompleto, tenta com a URL original
        if is_data_incomplete(data):
            html = requests.get(url, headers=HEADERS, timeout=10).text
            data = extract_mega_data(html, url)
        
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
            'url': url,
            'extractionStatus': 'failed',
            'error': str(e)
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
            data = extract_mega_data(html, url)
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

def extract_address(soup: BeautifulSoup) -> str:
    """
    Extrai o endereço do imóvel do HTML.
    """
    address_selectors = [
        'div[class*="address"]',
        'div[class*="location"]',
        'span[class*="address"]',
        'span[class*="location"]'
    ]
    
    for selector in address_selectors:
        element = soup.select_one(selector)
        if element:
            address = element.get_text(strip=True)
            if address and not address.startswith('R$'):
                return address
    
    return ""

def extract_city(soup: BeautifulSoup) -> str:
    """
    Extrai a cidade do imóvel do HTML.
    """
    location_selectors = [
        'div[class*="location"]',
        'span[class*="location"]',
        'div[class*="address"]',
        'span[class*="address"]'
    ]
    
    for selector in location_selectors:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(strip=True)
            # Procura por padrão "Cidade - Estado"
            match = re.search(r'([^-]+)\s*-\s*([A-Z]{2})', text)
            if match:
                return match.group(1).strip()
    
    return ""

def extract_state(soup: BeautifulSoup) -> str:
    """
    Extrai o estado do imóvel do HTML.
    """
    location_selectors = [
        'div[class*="location"]',
        'span[class*="location"]',
        'div[class*="address"]',
        'span[class*="address"]'
    ]
    
    for selector in location_selectors:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(strip=True)
            # Procura por padrão "Cidade - Estado"
            match = re.search(r'([^-]+)\s*-\s*([A-Z]{2})', text)
            if match:
                return match.group(2).strip()
    
    return ""

def extract_description(soup: BeautifulSoup) -> str:
    """
    Extrai a descrição do imóvel do HTML.
    """
    description_selectors = [
        'div[class*="description"]',
        'div[class*="details"]',
        'div[class*="info"]'
    ]
    
    for selector in description_selectors:
        element = soup.select_one(selector)
        if element:
            description = element.get_text(strip=True)
            if description:
                return description
    
    return ""

def extract_auction_date(soup: BeautifulSoup) -> str:
    """
    Extrai a data do leilão do HTML.
    """
    date_selectors = [
        'div[class*="date"]',
        'span[class*="date"]',
        'div[class*="auction"]',
        'span[class*="auction"]'
    ]
    
    for selector in date_selectors:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(strip=True)
            # Procura por padrão de data DD/MM/YYYY
            match = re.search(r'\d{2}/\d{2}/\d{4}', text)
            if match:
                try:
                    date_obj = datetime.strptime(match.group(0), '%d/%m/%Y')
                    return date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    continue
    
    return ""

def extract_evaluated_value(soup: BeautifulSoup) -> str:
    """
    Extrai o valor avaliado do imóvel do HTML.
    """
    value_selectors = [
        'div[class*="evaluated"]',
        'span[class*="evaluated"]',
        'div[class*="value"]',
        'span[class*="value"]'
    ]
    
    for selector in value_selectors:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(strip=True)
            # Procura por padrão de valor monetário
            match = re.search(r'R\$\s*([\d.,]+)', text)
            if match:
                return clean_currency_value(match.group(1))
    
    return ""

def extract_documents(soup: BeautifulSoup) -> List[str]:
    """
    Extrai os documentos do imóvel do HTML.
    """
    documents = []
    doc_selectors = [
        'div[class*="documents"] a',
        'div[class*="files"] a',
        'a[href*=".pdf"]',
        'a[href*=".doc"]'
    ]
    
    for selector in doc_selectors:
        elements = soup.select(selector)
        for element in elements:
            href = element.get('href')
            if href:
                documents.append(href)
    
    return documents

def extract_auctions(soup: BeautifulSoup) -> List[Dict[str, Any]]:
    """
    Extrai informações sobre os leilões do imóvel do HTML.
    """
    auctions = []
    auction_selectors = [
        'div[class*="auction"]',
        'div[class*="bid"]'
    ]
    
    for selector in auction_selectors:
        elements = soup.select(selector)
        for element in elements:
            auction_data = {}
            
            # Data do leilão
            date_match = re.search(r'\d{2}/\d{2}/\d{4}', element.get_text())
            if date_match:
                try:
                    date_obj = datetime.strptime(date_match.group(0), '%d/%m/%Y')
                    auction_data['date'] = date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    continue
            
            # Valor do lance
            value_match = re.search(r'R\$\s*([\d.,]+)', element.get_text())
            if value_match:
                auction_data['value'] = clean_currency_value(value_match.group(1))
            
            if auction_data:
                auctions.append(auction_data)
    
    return auctions 