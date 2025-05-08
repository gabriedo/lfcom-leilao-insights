from typing import Dict, Any, Optional, List, Tuple
from bs4 import BeautifulSoup
import re
from urllib.parse import urlparse
from abc import ABC, abstractmethod
import logging

logger = logging.getLogger(__name__)

def normalize_url(url: str) -> str:
    """Normaliza a URL para uso interno, preservando query params para a Caixa."""
    if "venda-imoveis.caixa.gov.br" in url:
        return url  # mantém completa
    # comportamento atual para os demais
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"

class BaseExtractor(ABC):
    """Classe base para todos os extractors de portais de leilão"""
    
    @abstractmethod
    async def extract(self, html: str, url: str) -> Dict[str, Any]:
        """Extrai dados do HTML da página"""
        pass
    
    def normalize_url(self, url: str) -> str:
        """Remove parâmetros de tracking e normaliza a URL"""
        # Remove parâmetros de tracking comuns
        url = re.sub(r'[?&](utm_source|utm_medium|utm_campaign|utm_term|utm_content)=[^&]+', '', url)
        # Remove ? ou & no final da URL
        url = re.sub(r'[?&]$', '', url)
        return url
    
    def extract_basic_data_from_html(self, html: str) -> Dict[str, Any]:
        """Extrai dados básicos comuns a todos os portais"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove scripts e estilos
        for script in soup(["script", "style"]):
            script.decompose()
            
        # Extrai texto
        text = soup.get_text()
        
        # Limpa o texto
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return {
            'text': text,
            'title': soup.title.string if soup.title else '',
            'description': soup.find('meta', {'name': 'description'})['content'] if soup.find('meta', {'name': 'description'}) else ''
        }

    def _get_domain(self) -> str:
        raise NotImplementedError("Subclasses must implement _get_domain")

    def _clean_text(self, text: str) -> str:
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text).strip()

    def _format_currency(self, value: str) -> float:
        if not value:
            return 0.0
        # Remove currency symbols and convert to float
        value = re.sub(r'[^\d,.]', '', value)
        value = value.replace('.', '').replace(',', '.')
        try:
            return float(value)
        except ValueError:
            return 0.0

def extract_basic_data_from_html(html: str, url: str) -> Dict[str, Any]:
    """
    Extrai dados básicos de uma propriedade a partir do HTML.
    Esta é uma implementação genérica para portais não suportados.
    """
    return {
        "extractionStatus": "success",
        "title": "",
        "description": "",
        "address": "",
        "city": "",
        "state": "",
        "propertyType": "",
        "auctionType": "Leilão",
        "minBid": "",
        "evaluatedValue": "",
        "auctionDate": "",
        "images": [],
        "documents": [],
        "auctions": []
    } 