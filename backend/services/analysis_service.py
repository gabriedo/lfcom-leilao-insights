import logging
import httpx
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional
from .extractors import extract_basic_data_from_html
from backend.utils.pre_analysis_logger import save_pre_analysis
import os
from datetime import datetime
from .html_utils import get_html_content, render_with_playwright

logger = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
}

def is_html_valid(html: str) -> bool:
    """Verifica se o HTML contém estrutura mínima esperada."""
    return "<html" in html.lower() and len(html) > 1000

def get_html_content(url: str) -> str:
    """Obtém o HTML da página com fallback para Playwright se necessário."""
    try:
        response = requests.get(url, timeout=10, headers=HEADERS)
        html = response.text
        if is_html_valid(html):
            return html
        else:
            print(f"[Fallback] HTML incompleto via requests em {url}, ativando Playwright.")
    except Exception as e:
        print(f"[Requests] Erro ao buscar {url}: {e}")

    return render_with_playwright(url)

def analyze_property(url: str) -> Dict[str, Any]:
    """Analisa uma propriedade a partir da URL fornecida"""
    try:
        logger.info(f"Iniciando análise da propriedade: {url}")
        
        # Obter HTML
        html = get_html_content(url)
        if not html:
            logger.error("Não foi possível obter o HTML da página")
            return {
                'error': 'Não foi possível acessar a página',
                'status': 'error'
            }
            
        # Extrair dados básicos
        data = extract_basic_data_from_html(html, url)
        if not data:
            logger.error("Não foi possível extrair dados da página")
            return {
                'error': 'Não foi possível extrair dados da página',
                'status': 'error'
            }
            
        # Adicionar status de sucesso
        data['status'] = 'success'
        
        # Validar campos obrigatórios
        missing_fields = []
        required_fields = ['title', 'minBid', 'propertyType', 'images']
        for field in required_fields:
            if not data.get(field):
                missing_fields.append(field)
                
        if missing_fields:
            logger.warning(f"Campos obrigatórios faltando: {', '.join(missing_fields)}")
            data['missingFields'] = missing_fields
            
        logger.info(f"Análise concluída com sucesso para: {url}")
        return data
        
    except Exception as e:
        logger.error(f"Erro ao analisar propriedade {url}: {str(e)}")
        return {
            'error': f'Erro ao analisar propriedade: {str(e)}',
            'status': 'error'
        }

async def analyze_property(url: str) -> Dict[str, Any]:
    """
    Analisa uma propriedade em leilão a partir da URL fornecida.
    """
    try:
        logger.info(f"Iniciando análise da propriedade: {url}")
        # Headers para simular um navegador
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, follow_redirects=True)
            response.raise_for_status()
            html = response.text
            logger.info(f"HTML obtido com sucesso para: {url}")
            # Salvar HTML para depuração
            try:
                domain = url.split('/')[2].replace('.', '_')
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                os.makedirs('backend/html_samples', exist_ok=True)
                filename = f"backend/html_samples/{domain}_{timestamp}.html"
                with open(filename, "w", encoding="utf-8") as f:
                    f.write(html)
                logger.info(f"HTML salvo em {filename}")
            except Exception as e:
                logger.warning(f"Não foi possível salvar o HTML: {e}")
            # Extrai dados básicos usando os extratores específicos
            basic_data = extract_basic_data_from_html(html, url)
            logger.info(f"Dados básicos extraídos com sucesso para: {url}")
            # Salva o resultado da pré-análise
            await save_pre_analysis(url, basic_data)
            logger.info(f"Pré-análise salva com sucesso para: {url}")
            return basic_data
    except httpx.HTTPError as e:
        error_msg = f"Erro HTTP ao acessar {url}: {str(e)}"
        logger.error(error_msg)
        await save_pre_analysis(url, None, error_msg)
        raise
    except Exception as e:
        error_msg = f"Erro ao analisar propriedade {url}: {str(e)}"
        logger.error(error_msg)
        await save_pre_analysis(url, None, error_msg)
        raise 