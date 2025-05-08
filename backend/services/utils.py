from urllib.parse import urlparse

def normalize_url(url: str) -> str:
    """Normaliza a URL para uso interno, preservando query params para a Caixa."""
    if "venda-imoveis.caixa.gov.br" in url:
        return url  # mantém completa
    # comportamento atual para os demais
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}" 