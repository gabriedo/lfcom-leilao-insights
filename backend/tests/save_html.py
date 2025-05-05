import asyncio
import httpx
import os
from urllib.parse import urlparse

async def save_html(url: str) -> None:
    """
    Salva o HTML de uma URL em um arquivo.
    """
    try:
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
            
            # Cria o diretório de testes se não existir
            os.makedirs('tests/html', exist_ok=True)
            
            # Gera um nome de arquivo baseado no domínio
            domain = urlparse(url).netloc.replace('.', '_')
            filename = f'tests/html/{domain}.html'
            
            # Salva o HTML
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(html)
            
            print(f"HTML salvo em: {filename}")
            
    except Exception as e:
        print(f"Erro ao salvar HTML de {url}: {str(e)}")
        raise

async def main():
    """
    Função principal para salvar o HTML dos sites.
    """
    # URLs de teste
    urls = [
        "https://www.portalzuk.com.br/imovel/sp/sao-paulo/jardim-monte-kemel/rua-david-ben-gurion-955/32919-201914",
        "https://www.megaleiloes.com.br/imoveis/hoteis/sp/olimpia/fracao-ideal-sobre-apartamento-comercial-61-m2-apart-hotel-no-solar-das-aguas-park-resort-parque-do-sol-olimpia-sp-j109665",
        "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=1555531017715"
    ]
    
    # Salva o HTML de cada URL
    for url in urls:
        try:
            await save_html(url)
        except Exception as e:
            print(f"Falha ao salvar HTML de {url}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(main()) 