import logging
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from typing import Dict, Any, Optional
import re
from datetime import datetime

logger = logging.getLogger(__name__)

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

def extract_zuk_data(html_content: str) -> dict:
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Extrair título
    title = None
    og_title = soup.find('meta', {'property': 'og:title'})
    if og_title:
        title = og_title.get('content')
    
    # Extrair valor mínimo do dataLayer
    minimum_value = None
    scripts = soup.find_all('script')
    for script in scripts:
        if script.string and 'dataLayer' in script.string:
            match = re.search(r"'valorMinimo':'([^']+)'", script.string)
            if match:
                try:
                    value_str = match.group(1).replace('.', '').replace(',', '.')
                    minimum_value = float(value_str)
                    logging.info(f"Valor mínimo extraído do dataLayer: {minimum_value}")
                except (ValueError, AttributeError) as e:
                    logging.error(f"Erro ao converter valor mínimo: {e}")
    
    # Extrair imagem
    image = None
    og_image = soup.find('meta', {'property': 'og:image'})
    if og_image:
        image = og_image.get('content')
        logging.info(f"Imagem extraída da meta tag og:image: {image}")
    
    # Extrair data do leilão do dataLayer
    auction_date = None
    for script in scripts:
        if script.string and 'dataLayer' in script.string:
            match = re.search(r"'leilaoData':'([^']+)'", script.string)
            if match:
                try:
                    date_str = match.group(1)
                    date_parts = date_str.split('/')
                    if len(date_parts) == 3:
                        auction_date = f"{date_parts[2]}-{date_parts[1]}-{date_parts[0]}T00:00:00"
                        logging.info(f"Data do leilão extraída do dataLayer: {auction_date}")
                except (ValueError, AttributeError) as e:
                    logging.error(f"Erro ao converter data do leilão: {e}")
    
    # Se não encontrou no dataLayer, busca no bloco visual do leilão
    if not auction_date:
        main = soup.find('main', class_='imovel-main')
        bloco = None
        if main:
            # Tenta encontrar o bloco lateral do leilão
            bloco = main.find('div', class_='property')
        if bloco:
            bloco_text = bloco.get_text(separator=' ', strip=True)
            logging.info(f"[ZUK] Texto bruto do bloco de leilão analisado: {bloco_text}")
            # Regex tolerante: data (dd/mm/yy ou dd/mm/yyyy) seguida de 'às' e hora (hhhmm ou hh:mm)
            date_pattern = re.compile(r'(\d{2}/\d{2}/\d{2,4})\s*às\s*(\d{2}h\d{2}|\d{2}:\d{2})', re.IGNORECASE)
            match = date_pattern.search(bloco_text)
            if match:
                try:
                    date_str = match.group(1)
                    hour_str = match.group(2).replace('h', ':')
                    # Ajusta ano para 20xx se necessário
                    day, month, year = date_str.split('/')
                    if len(year) == 2:
                        year = '20' + year
                    auction_date = f"{year}-{month}-{day}T{hour_str}:00"
                    logging.info(f"Data do leilão extraída do bloco visual: {auction_date}")
                except Exception as e:
                    logging.error(f"Erro ao converter data do leilão do bloco visual: {e}")
        else:
            logging.warning("[ZUK] Bloco visual do leilão não encontrado para extração da data.")
    
    # Extrair endereço, cidade e estado do dataLayer
    address = None
    city = None
    state = None
    for script in scripts:
        if script.string and 'dataLayer' in script.string:
            match = re.search(r"'uf':'([^']+)',\s*'cidade':'([^']+)',\s*'bairro':'([^']+)'", script.string)
            if match:
                try:
                    state = match.group(1)
                    city = match.group(2)
                    address = match.group(3)
                    logging.info(f"Endereço extraído do dataLayer: {address}, {city}/{state}")
                except (ValueError, AttributeError) as e:
                    logging.error(f"Erro ao extrair endereço: {e}")
    
    return {
        'title': title,
        'minimum_value': minimum_value,
        'image': image,
        'auction_date': auction_date,
        'address': address,
        'city': city,
        'state': state
    }

def extract_mega_data(html: str) -> dict:
    """Extrai dados básicos do Mega Leilões."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Título
        title = soup.find('title').text.strip()
        if '| Mega Leilões' in title:
            title = title.split('| Mega Leilões')[0].strip()
            
        # Valor mínimo
        min_value = None
        # Procura em várias classes possíveis
        for class_name in ['valor-minimo', 'valor', 'price']:
            price_div = soup.find('div', {'class': class_name})
            if price_div:
                price_text = price_div.text.strip()
                match = re.search(r'R\$\s*([\d.,]+)', price_text)
                if match:
                    min_value = match.group(1)
                    break
                    
        # Imagem
        image = None
        og_image = soup.find('meta', {'property': 'og:image'})
        if og_image:
            image = og_image.get('content')
            
        # Data do leilão
        auction_date = None
        # Tenta encontrar a data em qualquer texto da página
        date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')
        for text in soup.stripped_strings:
            if 'leilão' in text.lower() or 'data' in text.lower():
                match = date_pattern.search(text)
                if match:
                    try:
                        auction_date = datetime.strptime(match.group(1), '%d/%m/%Y').isoformat()
                        break
                    except:
                        pass
                
        # Endereço, cidade e estado
        address = None
        city = None
        state = None

        # Busca bloco de endereço
        address_block = None
        # Mega Leilões geralmente coloca o endereço em <div class="endereco"> ou similar
        for class_name in ['endereco', 'address', 'localizacao', 'property-address']:
            address_block = soup.find('div', class_=class_name)
            if address_block:
                break
        if not address_block:
            # fallback: busca por <span> ou <p> com cidade/estado
            for tag in soup.find_all(['span', 'p']):
                if tag and tag.text and 'olímpia' in tag.text.lower() and 'sp' in tag.text.upper():
                    address_block = tag
                    break
        if address_block:
            raw_text = address_block.get_text(separator=' ', strip=True)
            logging.info(f"[MEGALEILOES] Bloco de endereço bruto: {raw_text}")
            # Regex para cidade e estado: Olímpia - SP
            match = re.search(r'([A-Za-zÀ-ÿ\s]+)[,\-\|\/]\s*([A-Z]{2})', raw_text)
            if match:
                city = match.group(1).strip().title()
                state = match.group(2).strip().upper()
        # fallback: tenta extrair do título se não encontrou
        if (not city or not state) and title:
            parts = title.split(' - ')
            for part in reversed(parts):
                if re.match(r'^[A-Z]{2}$', part.strip()):
                    state = part.strip().upper()
                elif not city and len(part.strip()) > 2:
                    city = part.strip().title()
        # fallback: tenta extrair da URL
        if (not city or not state):
            canonical = soup.find('link', {'rel': 'canonical'})
            if canonical:
                url_match = re.search(r'/([a-z]{2})/([^/]+)/', canonical.get('href'))
                if url_match:
                    state = url_match.group(1).upper()
                    city = url_match.group(2).replace('-', ' ').title()
        # Correção final: se cidade e estado invertidos
        if city and state and len(city) == 2 and len(state) > 2:
            city, state = state, city
        # Normalização final
        if city:
            city = city.strip().title()
        if state:
            state = state.strip().upper()
        return {
            'title': title,
            'minimum_value': min_value,
            'image': image,
            'auction_date': auction_date,
            'address': address,
            'city': city,
            'state': state
        }
    except Exception as e:
        logger.error(f"Erro ao extrair dados do Mega Leilões: {str(e)}")
        return None

def extract_caixa_data(html: str) -> dict:
    """Extrai dados básicos do site da Caixa."""
    try:
        soup = BeautifulSoup(html, 'html.parser')
        
        # Título
        title = None
        h5 = soup.find('h5', {'style': 'margin-bottom: 0.5rem; color: #006bae;'})
        if h5:
            title = h5.text.strip()
            
        # Valor mínimo
        min_value = None
        content = soup.find('div', {'class': 'content'})
        if content:
            p = content.find('p')
            if p:
                match = re.search(r'Valor mínimo de venda 1º Leilão: R\$ ([\d.,]+)', p.text)
                if match:
                    min_value = match.group(1)
                    
        # Imagem
        image = None
        # Procura em várias classes possíveis
        for class_name in ['preview', 'img-imovel', 'foto']:
            img = soup.find('img', {'class': class_name})
            if img:
                image = img.get('src')
                if image and not image.startswith('http'):
                    image = f"https://venda-imoveis.caixa.gov.br/{image.lstrip('/')}"
                break
                
        # Se não encontrou a imagem, procura na galeria
        if not image:
            gallery = soup.find('div', {'class': 'thumbnails'})
            if gallery:
                img = gallery.find('img')
                if img:
                    image = img.get('src')
                    if image and not image.startswith('http'):
                        image = f"https://venda-imoveis.caixa.gov.br/{image.lstrip('/')}"
                
        # Data do leilão
        auction_date = None
        # Tenta encontrar a data em qualquer texto da página
        date_pattern = re.compile(r'(\d{2}/\d{2}/\d{4})')
        for text in soup.stripped_strings:
            if 'leilão' in text.lower() or 'data' in text.lower():
                match = date_pattern.search(text)
                if match:
                    try:
                        auction_date = datetime.strptime(match.group(1), '%d/%m/%Y').isoformat()
                        break
                    except:
                        pass
                
        # Endereço, cidade e estado
        address = None
        city = None
        state = None
        # Busca bloco de endereço
        # Normalmente está em <span> com 'Endereço:'
        for span in soup.find_all('span'):
            text = span.text.strip()
            if text.startswith('Endereço:'):
                address = text.replace('Endereço:', '').strip()
                break
        # fallback: busca em <p> ou <div> se não encontrou
        if not address:
            for tag in soup.find_all(['p', 'div']):
                if tag and tag.text and 'Endereço:' in tag.text:
                    address = tag.text.split('Endereço:')[-1].strip()
                    break
        # Normalização final do endereço
        if address:
            address = address.replace('\n', ' ').replace('  ', ' ').strip()
        # Cidade e estado
        breadcrumb = soup.find('p', {'class': 'breadcrumb'})
        if breadcrumb:
            text = breadcrumb.text.strip()
            match = re.search(r'([^/]+)/([A-Z]{2})', text)
            if match:
                city = match.group(1).strip()
                state = match.group(2)
        # Tenta extrair o endereço e cidade/estado de spans
        spans = soup.find_all('span')
        for span in spans:
            text = span.text.strip()
            if 'Comarca:' in text:
                comarca = text.replace('Comarca:', '').strip()
                if '-' in comarca:
                    city, state = comarca.split('-')
                    city = city.strip()
                    state = state.strip()
        return {
            'title': title,
            'minimum_value': min_value,
            'image': image,
            'auction_date': auction_date,
            'address': address,
            'city': city,
            'state': state
        }
    except Exception as e:
        logger.error(f"Erro ao extrair dados da Caixa: {str(e)}")
        return None

def extract_basic_data_from_html(html: str, url: str) -> dict:
    """Extrai dados básicos do HTML baseado no domínio."""
    try:
        if 'portalzuk.com.br' in url:
            return extract_zuk_data(html)
        elif 'megaleiloes.com.br' in url:
            return extract_mega_data(html)
        elif 'venda-imoveis.caixa.gov.br' in url:
            return extract_caixa_data(html)
        else:
            # Extrator genérico para outros domínios
            soup = BeautifulSoup(html, 'html.parser')
            
            # Título
            title = soup.find('title').text.strip()
            
            # Valor mínimo
            min_value = None
            price_pattern = re.compile(r'R\$\s*([\d.,]+)')
            for text in soup.stripped_strings:
                match = price_pattern.search(text)
                if match:
                    min_value = match.group(1)
                    break
                    
            # Imagem
            image = None
            og_image = soup.find('meta', {'property': 'og:image'})
            if og_image:
                image = og_image.get('content')
                
            # Data do leilão
            auction_date = None
            date_pattern = re.compile(r'\d{2}/\d{2}/\d{4}')
            for text in soup.stripped_strings:
                match = date_pattern.search(text)
                if match:
                    try:
                        auction_date = datetime.strptime(match.group(0), '%d/%m/%Y').isoformat()
                        break
                    except:
                        pass
                        
            # Endereço, cidade e estado
            address = None
            city = None
            state = None
            
            location_pattern = re.compile(r'([^,]+),\s*([^,]+),\s*([A-Z]{2})')
            for text in soup.stripped_strings:
                match = location_pattern.search(text)
                if match:
                    address = match.group(1).strip()
                    city = match.group(2).strip()
                    state = match.group(3).strip()
                    break
                    
            return {
                'title': title,
                'minimum_value': min_value,
                'image': image,
                'auction_date': auction_date,
                'address': address,
                'city': city,
                'state': state
            }
    except Exception as e:
        logger.error(f"Erro ao extrair dados básicos: {str(e)}")
        return None

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