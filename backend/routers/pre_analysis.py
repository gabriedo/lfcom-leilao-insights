from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import json
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from typing import Optional
import logging
from backend.app.utils.logger import log_url
from backend.app.models.url_log import URLLog, URLLogCreate
import os

logger = logging.getLogger(__name__)

router = APIRouter()

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

class UrlPayload(BaseModel):
    url: HttpUrl

class PreAnalysisResponse(BaseModel):
    valido: bool
    site: str
    titulo: Optional[str] = None
    valor_minimo: Optional[str] = None
    imagem: Optional[str] = None
    data_leilao: Optional[str] = None
    mensagem: Optional[str] = None
    sugestao: Optional[str] = None
    whatsapp: Optional[str] = None

def load_domains(file_path: str) -> list:
    with open(file_path, 'r') as f:
        data = json.load(f)
        return data.get('domains', [])

def extract_value_minimo(text: str) -> Optional[str]:
    # Procura por valores no formato R$ X.XXX,XX ou R$ X.XXX,XX
    pattern = r'R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_data_leilao(text: str) -> Optional[str]:
    # Procura por datas no formato YYYY-MM-DD ou DD/MM/YYYY
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

def extract_sodre_santoro_data(soup: BeautifulSoup) -> tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    """Extrai dados específicos do site da Sodré Santoro"""
    titulo = None
    valor_minimo = None
    imagem = None
    data_leilao = None

    # Título - procura em várias tags possíveis
    for selector in ['.product-title', 'h1.title', '.lot-title']:
        element = soup.select_one(selector)
        if element:
            titulo = element.text.strip()
            break
    
    if not titulo:
        meta_title = soup.find('meta', property='og:title')
        if meta_title:
            titulo = meta_title.get('content', '').strip()

    # Valor mínimo - procura em várias classes possíveis
    for selector in ['.price', '.lot-price', '.value']:
        element = soup.select_one(selector)
        if element:
            valor = extract_value_minimo(element.text)
            if valor:
                valor_minimo = valor
                break

    # Imagem - procura em várias fontes possíveis
    for selector in ['.product-image img', '.lot-image img', '.main-image img']:
        element = soup.select_one(selector)
        if element and element.get('src'):
            imagem = element['src']
            break
    
    if not imagem:
        meta_image = soup.find('meta', property='og:image')
        if meta_image:
            imagem = meta_image.get('content')

    # Data do leilão - procura em várias classes possíveis
    for selector in ['.auction-date', '.lot-date', '.date']:
        element = soup.select_one(selector)
        if element:
            data = extract_data_leilao(element.text)
            if data:
                data_leilao = data
                break

    return titulo, valor_minimo, imagem, data_leilao

@router.post("/pre-analyze", response_model=PreAnalysisResponse)
async def pre_analyze(payload: UrlPayload):
    # Carrega as listas de domínios
    file_path = os.path.join(os.path.dirname(__file__), '../../data/leiloeiros.json')
    trusted_domains = load_domains(file_path)
    file_path_fraudes = os.path.join(os.path.dirname(__file__), '../../data/fraudes.json')
    fraud_domains = load_domains(file_path_fraudes)
    
    # Extrai o domínio da URL
    domain = urlparse(str(payload.url)).netloc
    
    # Verifica se o domínio é confiável ou suspeito
    if domain in fraud_domains:
        response = PreAnalysisResponse(
            valido=False,
            site=domain,
            mensagem="Este site não é reconhecido como leiloeiro oficial.",
            sugestao="Entre em contato com um especialista via WhatsApp para validar esta oferta.",
            whatsapp="https://wa.me/5500000000000"
        )
        
        # Tenta registrar o log sem afetar a resposta
        try:
            log_data = URLLogCreate(
                url=str(payload.url),
                dominio=domain,
                status="suspeito"
            )
            await log_url(log_data)
        except Exception as e:
            logger.error(f"Erro ao registrar log de URL: {str(e)}")
            # Fallback silencioso - não afeta a resposta da API
            pass
            
        return response
    
    if domain not in trusted_domains:
        response = PreAnalysisResponse(
            valido=False,
            site=domain,
            mensagem="Este site não está em nossa lista de leiloeiros oficiais.",
            sugestao="Entre em contato com um especialista via WhatsApp para validar esta oferta.",
            whatsapp="https://wa.me/5500000000000"
        )
        
        # Tenta registrar o log sem afetar a resposta
        try:
            log_data = URLLogCreate(
                url=str(payload.url),
                dominio=domain,
                status="suspeito"
            )
            await log_url(log_data)
        except Exception as e:
            logger.error(f"Erro ao registrar log de URL: {str(e)}")
            # Fallback silencioso - não afeta a resposta da API
            pass
            
        return response
    
    try:
        # Faz o scraping da página
        response = requests.get(str(payload.url), headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extrai as informações baseado no domínio
        if 'sodresantoro.com.br' in domain:
            titulo, valor_minimo, imagem, data_leilao = extract_sodre_santoro_data(soup)
        else:
            # Extração padrão para outros sites
            titulo = None
            h1 = soup.find('h1')
            if h1:
                titulo = h1.text.strip()
            else:
                title = soup.find('title')
                if title:
                    titulo = title.text.strip()
            
            valor_minimo = None
            for text in soup.stripped_strings:
                valor = extract_value_minimo(text)
                if valor:
                    valor_minimo = valor
                    break
            
            imagem = None
            img = soup.find('img')
            if img and img.get('src'):
                imagem = img['src']
                if not imagem.startswith(('http://', 'https://')):
                    base_url = f"{urlparse(str(payload.url)).scheme}://{domain}"
                    imagem = f"{base_url.rstrip('/')}/{imagem.lstrip('/')}"
            
            data_leilao = None
            for text in soup.stripped_strings:
                data = extract_data_leilao(text)
                if data:
                    data_leilao = data
                    break
        
        response = PreAnalysisResponse(
            valido=True,
            site=domain,
            titulo=titulo,
            valor_minimo=valor_minimo,
            imagem=imagem,
            data_leilao=data_leilao
        )
        
        # Tenta registrar o log sem afetar a resposta
        try:
            log_data = URLLogCreate(
                url=str(payload.url),
                dominio=domain,
                status="confiável"
            )
            await log_url(log_data)
        except Exception as e:
            logger.error(f"Erro ao registrar log de URL: {str(e)}")
            # Fallback silencioso - não afeta a resposta da API
            pass
            
        return response
        
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "unreachable_url", "message": str(e)}
        )

async def extract_basic_data_from_html(html: str, url: str) -> dict:
    """
    Extrai dados básicos de uma página de leilão de imóveis.
    """
    soup = BeautifulSoup(html, 'html.parser')
    domain = urlparse(url).netloc

    # Caso Sodré Santoro
    if 'sodresantoro.com.br' in domain:
        if 'extract_sodre_santoro_data' in globals():
            titulo, valor_minimo, imagem, data_leilao = extract_sodre_santoro_data(soup)
            return {
                "titulo": titulo,
                "valor_minimo": valor_minimo,
                "imagem": imagem,
                "data_leilao": data_leilao
            }

    # Scraping genérico
    # Título
    titulo = None
    h1 = soup.find('h1')
    if h1:
        titulo = h1.text.strip()
    else:
        title = soup.find('title')
        if title:
            titulo = title.text.strip()

    # Valor mínimo
    valor_minimo = None
    for text in soup.stripped_strings:
        valor = extract_value_minimo(text)
        if valor:
            valor_minimo = valor
            break

    # Imagem
    imagem = None
    img = soup.find('img')
    if img and img.get('src'):
        imagem = img['src']
        if not imagem.startswith(('http://', 'https://')):
            base_url = f"{urlparse(url).scheme}://{domain}"
            imagem = f"{base_url.rstrip('/')}/{imagem.lstrip('/')}"

    # Data do leilão
    data_leilao = None
    for text in soup.stripped_strings:
        data = extract_data_leilao(text)
        if data:
            data_leilao = data
            break

    return {
        "titulo": titulo,
        "valor_minimo": valor_minimo,
        "imagem": imagem,
        "data_leilao": data_leilao
    } 