import logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from typing import Dict, Any, Optional
from backend.utils.pre_analysis_logger import save_pre_analysis

logger = logging.getLogger(__name__)

# Headers para simular um navegador
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1'
}

async def analyze_property(url: str) -> None:
    """
    Analisa uma propriedade a partir da URL fornecida.
    Esta função é executada em background.
    """
    try:
        logger.info(f"Iniciando análise da propriedade: {url}")
        
        # Faz o scraping da página
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        
        # Extrai os dados básicos
        extracted_data = await extract_basic_data(response.text, url)
        
        # Salva o resultado
        await save_pre_analysis(
            url=url,
            status="completed",
            result=extracted_data,
            error=None
        )
        
        logger.info(f"Análise concluída com sucesso para URL: {url}")
        
    except requests.RequestException as e:
        logger.error(f"Erro ao acessar URL {url}: {str(e)}")
        await save_pre_analysis(
            url=url,
            status="error",
            error=f"Erro ao acessar URL: {str(e)}",
            result=None
        )
    except Exception as e:
        logger.error(f"Erro ao analisar propriedade {url}: {str(e)}")
        await save_pre_analysis(
            url=url,
            status="error",
            error=f"Erro interno: {str(e)}",
            result=None
        )

async def extract_basic_data(html: str, url: str) -> Dict[str, Any]:
    """
    Extrai dados básicos de uma página de leilão de imóveis.
    """
    soup = BeautifulSoup(html, 'html.parser')
    domain = urlparse(url).netloc
    
    # Inicializa as variáveis
    titulo = None
    valor_minimo = None
    imagem = None
    data_leilao = None
    
    # Extrai o título
    titulo_candidates = [
        soup.find('h1'),  # Título principal
        soup.find('meta', property='og:title'),  # Meta tag do Open Graph
        soup.find('title'),  # Tag title
        soup.find(class_=lambda x: x and ('title' in x.lower() or 'produto' in x.lower() or 'lote' in x.lower()))
    ]
    
    for candidate in titulo_candidates:
        if candidate:
            if candidate.name == 'meta':
                titulo = candidate.get('content', '').strip()
            else:
                titulo = candidate.text.strip()
            if titulo:
                break
    
    # Extrai o valor mínimo
    for element in soup.find_all(['div', 'span', 'p']):
        if element.text and 'R$' in element.text:
            valor = extract_value_minimo(element.text)
            if valor:
                valor_minimo = valor
                break
    
    # Extrai a imagem
    imagem_candidates = [
        soup.find('meta', property='og:image'),
        soup.find('img', class_=lambda x: x and ('principal' in x.lower() or 'main' in x.lower() or 'produto' in x.lower() or 'lote' in x.lower())),
        soup.find('img')
    ]
    
    for candidate in imagem_candidates:
        if candidate:
            if candidate.name == 'meta':
                imagem = candidate.get('content')
            else:
                imagem = candidate.get('src')
            if imagem:
                # Converte URLs relativas em absolutas
                if imagem.startswith('/'):
                    parsed_url = urlparse(url)
                    imagem = f"{parsed_url.scheme}://{parsed_url.netloc}{imagem}"
                break
    
    # Extrai a data do leilão
    for element in soup.find_all(['div', 'span', 'p']):
        if element.text:
            data = extract_data_leilao(element.text)
            if data:
                data_leilao = data
                break
    
    # Se não encontrou título em nenhum lugar, usa o título da página como fallback
    if not titulo and soup.title:
        titulo = soup.title.text.strip()
    
    return {
        "titulo": titulo,
        "valor_minimo": valor_minimo,
        "imagem": imagem,
        "data_leilao": data_leilao
    }

def extract_value_minimo(text: str) -> Optional[str]:
    """
    Extrai o valor mínimo do texto.
    """
    import re
    pattern = r'R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_data_leilao(text: str) -> Optional[str]:
    """
    Extrai a data do leilão do texto.
    """
    import re
    from datetime import datetime
    
    patterns = [
        r'\d{4}-\d{2}-\d{2}',  # YYYY-MM-DD
        r'\d{2}/\d{2}/\d{4}'   # DD/MM/YYYY
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            date_str = match.group(0)
            try:
                # Tenta converter para o formato YYYY-MM-DD
                if '/' in date_str:
                    date_obj = datetime.strptime(date_str, '%d/%m/%Y')
                    return date_obj.strftime('%Y-%m-%d')
                return date_str
            except ValueError:
                continue
    return None 