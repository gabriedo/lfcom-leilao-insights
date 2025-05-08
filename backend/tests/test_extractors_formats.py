import pytest
from bs4 import BeautifulSoup
from backend.services.extractors import MegaLeiloesExtractor, ZukExtractor, BaseExtractor

@pytest.fixture
def mega_leiloes_html_variants():
    """Fixture com diferentes formatos de HTML do Mega Leilões"""
    return {
        "standard": """
        <div class="property-details">
            <h1>Imóvel Teste</h1>
            <p class="price">R$ 100.000,00</p>
            <p class="address">Rua Teste, 123</p>
            <p class="city">São Paulo</p>
            <p class="state">SP</p>
            <p class="type">Casa</p>
            <p class="auction-date">01/01/2024</p>
        </div>
        """,
        "minimal": """
        <div class="property-details">
            <h1>Imóvel Teste</h1>
            <p class="price">R$ 100.000,00</p>
        </div>
        """,
        "formatted": """
        <div class="property-details">
            <h1>Imóvel Teste</h1>
            <p class="price">R$ 100.000,00</p>
            <p class="address">Rua Teste, 123 - São Paulo/SP</p>
            <p class="type">Casa</p>
            <p class="auction-date">01/01/2024 às 14:00</p>
        </div>
        """,
        "with_images": """
        <div class="property-details">
            <h1>Imóvel Teste</h1>
            <p class="price">R$ 100.000,00</p>
            <div class="gallery">
                <img src="imagem1.jpg" alt="Imagem 1">
                <img src="imagem2.jpg" alt="Imagem 2">
            </div>
        </div>
        """
    }

@pytest.fixture
def zuk_html_variants():
    """Fixture com diferentes formatos de HTML do Zuk"""
    return {
        "standard": """
        <div class="property-info">
            <h1>Imóvel Teste</h1>
            <div class="price">R$ 100.000,00</div>
            <div class="location">Rua Teste, 123 - São Paulo/SP</div>
            <div class="type">Casa</div>
            <div class="auction-date">01/01/2024</div>
        </div>
        """,
        "minimal": """
        <div class="property-info">
            <h1>Imóvel Teste</h1>
            <div class="price">R$ 100.000,00</div>
        </div>
        """,
        "formatted": """
        <div class="property-info">
            <h1>Imóvel Teste</h1>
            <div class="price">R$ 100.000,00</div>
            <div class="location">Rua Teste, 123 - São Paulo/SP</div>
            <div class="type">Casa</div>
            <div class="auction-date">01/01/2024 às 14:00</div>
        </div>
        """,
        "with_documents": """
        <div class="property-info">
            <h1>Imóvel Teste</h1>
            <div class="price">R$ 100.000,00</div>
            <div class="documents">
                <a href="documento1.pdf">Documento 1</a>
                <a href="documento2.pdf">Documento 2</a>
            </div>
        </div>
        """
    }

def test_mega_leiloes_extractor_variants(mega_leiloes_html_variants):
    """Testa o extractor do Mega Leilões com diferentes formatos de HTML"""
    extractor = MegaLeiloesExtractor()
    
    # Testa formato padrão
    soup = BeautifulSoup(mega_leiloes_html_variants["standard"], "html.parser")
    data = extractor.extract(soup)
    assert data["title"] == "Imóvel Teste"
    assert data["minBid"] == 100000.00
    assert data["address"] == "Rua Teste, 123"
    assert data["city"] == "São Paulo"
    assert data["state"] == "SP"
    assert data["type"] == "Casa" or data["propertyType"] == "Casa"
    assert data["auctionDate"] == "01/01/2024"
    
    # Testa formato mínimo
    soup = BeautifulSoup(mega_leiloes_html_variants["minimal"], "html.parser")
    data = extractor.extract(soup)
    assert data["title"] == "Imóvel Teste"
    assert data["minBid"] == 100000.00
    assert "address" not in data or not data["address"]
    assert "city" not in data or not data["city"]
    assert "state" not in data or not data["state"]
    assert "type" not in data or not data["type"]
    assert "auctionDate" not in data or not data["auctionDate"]
    
    # Testa formato com endereço combinado
    soup = BeautifulSoup(mega_leiloes_html_variants["formatted"], "html.parser")
    data = extractor.extract(soup)
    assert data["address"] == "Rua Teste, 123 - São Paulo/SP"
    
    # Testa formato com imagens
    soup = BeautifulSoup(mega_leiloes_html_variants["with_images"], "html.parser")
    data = extractor.extract(soup)
    assert "images" in data
    assert len(data["images"]) == 2
    assert data["images"][0] == "imagem1.jpg"
    assert data["images"][1] == "imagem2.jpg"

def test_zuk_extractor_variants(zuk_html_variants):
    """Testa o extractor do Zuk com diferentes formatos de HTML"""
    extractor = ZukExtractor()
    
    # Testa formato padrão
    soup = BeautifulSoup(zuk_html_variants["standard"], "html.parser")
    data = extractor.extract(soup)
    assert data["title"] == "Imóvel Teste"
    assert data["minBid"] == 100000.00
    assert data["address"] == "Rua Teste, 123 - São Paulo/SP"
    assert data["type"] == "Casa" or data["propertyType"] == "Casa"
    assert data["auctionDate"] == "01/01/2024"
    
    # Testa formato mínimo
    soup = BeautifulSoup(zuk_html_variants["minimal"], "html.parser")
    data = extractor.extract(soup)
    assert data["title"] == "Imóvel Teste"
    assert data["minBid"] == 100000.00
    assert "address" not in data or not data["address"]
    assert "type" not in data or not data["type"]
    assert "auctionDate" not in data or not data["auctionDate"]
    
    # Testa formato com data e hora
    soup = BeautifulSoup(zuk_html_variants["formatted"], "html.parser")
    data = extractor.extract(soup)
    assert data["auctionDate"] == "01/01/2024 às 14:00"
    
    # Testa formato com documentos
    soup = BeautifulSoup(zuk_html_variants["with_documents"], "html.parser")
    data = extractor.extract(soup)
    assert "documents" in data
    assert len(data["documents"]) == 2
    assert data["documents"][0] == "documento1.pdf"
    assert data["documents"][1] == "documento2.pdf"

def test_extractor_error_handling():
    """Testa o tratamento de erros dos extractors"""
    extractor = MegaLeiloesExtractor()
    # Testa com HTML inválido
    result = extractor.extract(None)
    assert result["extractionStatus"] == "failed"
    # Testa com HTML vazio
    soup = BeautifulSoup("", "html.parser")
    result = extractor.extract(soup)
    assert result["extractionStatus"] == "failed"
    # Testa com HTML sem dados relevantes
    soup = BeautifulSoup("<div></div>", "html.parser")
    result = extractor.extract(soup)
    assert result["extractionStatus"] == "failed" 