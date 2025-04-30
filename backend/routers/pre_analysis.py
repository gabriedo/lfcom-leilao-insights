from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, HttpUrl
from urllib.parse import urlparse
import json
import requests
from bs4 import BeautifulSoup
import re
from datetime import datetime
from typing import Optional

router = APIRouter()

# Headers para simular um navegador
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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

@router.post("/pre-analyze", response_model=PreAnalysisResponse)
async def pre_analyze(payload: UrlPayload):
    # Carrega as listas de domínios
    trusted_domains = load_domains('data/leiloeiros.json')
    fraud_domains = load_domains('data/fraudes.json')
    
    # Extrai o domínio da URL
    domain = urlparse(str(payload.url)).netloc
    
    # Verifica se o domínio é confiável ou suspeito
    if domain in fraud_domains:
        return PreAnalysisResponse(
            valido=False,
            site=domain,
            mensagem="Este site não é reconhecido como leiloeiro oficial.",
            sugestao="Entre em contato com um especialista via WhatsApp para validar esta oferta.",
            whatsapp="https://wa.me/5500000000000"
        )
    
    if domain not in trusted_domains:
        return PreAnalysisResponse(
            valido=False,
            site=domain,
            mensagem="Este site não está em nossa lista de leiloeiros oficiais.",
            sugestao="Entre em contato com um especialista via WhatsApp para validar esta oferta.",
            whatsapp="https://wa.me/5500000000000"
        )
    
    try:
        # Faz o scraping da página
        response = requests.get(str(payload.url), headers=HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extrai as informações
        titulo = None
        h1 = soup.find('h1')
        if h1:
            titulo = h1.text.strip()
        else:
            title = soup.find('title')
            if title:
                titulo = title.text.strip()
        
        # Procura por valor mínimo em todo o texto da página
        valor_minimo = None
        for text in soup.stripped_strings:
            valor = extract_value_minimo(text)
            if valor:
                valor_minimo = valor
                break
        
        # Procura pela primeira imagem
        imagem = None
        img = soup.find('img')
        if img and img.get('src'):
            imagem = img['src']
            if not imagem.startswith(('http://', 'https://')):
                # Converte URL relativa para absoluta
                base_url = f"{urlparse(str(payload.url)).scheme}://{domain}"
                imagem = f"{base_url.rstrip('/')}/{imagem.lstrip('/')}"
        
        # Procura por data do leilão
        data_leilao = None
        for text in soup.stripped_strings:
            data = extract_data_leilao(text)
            if data:
                data_leilao = data
                break
        
        return PreAnalysisResponse(
            valido=True,
            site=domain,
            titulo=titulo,
            valor_minimo=valor_minimo,
            imagem=imagem,
            data_leilao=data_leilao
        )
        
    except requests.RequestException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "unreachable_url", "message": str(e)}
        ) 