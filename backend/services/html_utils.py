import os
import logging
import requests
from playwright.sync_api import sync_playwright
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)

def save_html_for_debug(html: str, url: str, source: str) -> None:
    """Salva o HTML em um arquivo para debug"""
    try:
        # Criar diretório de debug se não existir
        debug_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'debug')
        os.makedirs(debug_dir, exist_ok=True)
        
        # Criar nome do arquivo baseado na URL e timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        domain = url.split('//')[1].split('/')[0].replace('.', '_')
        filename = f"{domain}_{timestamp}_{source}.html"
        filepath = os.path.join(debug_dir, filename)
        
        # Salvar HTML
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html)
            
        logger.info(f"HTML salvo para debug em: {filepath}")
    except Exception as e:
        logger.error(f"Erro ao salvar HTML para debug: {str(e)}")

def render_with_playwright(url: str) -> Optional[str]:
    """Renderiza a página usando Playwright para lidar com JavaScript"""
    try:
        logger.info(f"Iniciando renderização com Playwright para: {url}")
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            # Configurar timeout e headers
            page.set_default_timeout(30000)  # 30 segundos
            page.set_extra_http_headers({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            
            # Navegar para a URL
            response = page.goto(url, wait_until='networkidle')
            if not response:
                logger.error("Falha ao carregar a página com Playwright")
                return None
                
            # Aguardar carregamento completo
            page.wait_for_load_state('domcontentloaded')
            page.wait_for_load_state('networkidle')
            
            # Obter HTML renderizado
            html = page.content()
            
            # Verificar se o HTML é válido
            if not html or len(html.strip()) < 100:
                logger.warning("HTML renderizado parece inválido ou muito curto")
                return None
                
            # Salvar HTML para debug
            save_html_for_debug(html, url, 'playwright')
            
            browser.close()
            logger.info("Renderização com Playwright concluída com sucesso")
            return html
            
    except Exception as e:
        logger.error(f"Erro ao renderizar com Playwright: {str(e)}")
        return None

def get_html_content(url: str) -> Optional[str]:
    """Obtém o conteúdo HTML da URL, tentando primeiro com requests e depois com Playwright se necessário"""
    try:
        # Primeira tentativa com requests
        logger.info(f"Tentando obter HTML com requests para: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        
        html = response.text
        if html and len(html.strip()) > 100:
            logger.info("HTML obtido com sucesso via requests")
            save_html_for_debug(html, url, 'requests')
            return html
            
        logger.warning("HTML obtido via requests parece inválido, tentando Playwright")
        
    except requests.RequestException as e:
        logger.error(f"Erro na requisição HTTP: {str(e)}")
    except Exception as e:
        logger.error(f"Erro inesperado ao obter HTML: {str(e)}")
    
    # Se chegou aqui, tenta com Playwright
    logger.info("Tentando obter HTML com Playwright")
    return render_with_playwright(url) 