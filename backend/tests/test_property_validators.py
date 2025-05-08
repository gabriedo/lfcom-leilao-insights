import pytest
from datetime import datetime
from backend.models.property import Property

def test_parse_numeric_fields():
    """Testa a validação de campos numéricos"""
    # Teste com valores válidos
    property_data = {
        "minBid": "100.000,00",
        "evaluatedValue": "150.000,00"
    }
    property = Property(**property_data)
    assert property.minBid == 100000.00
    assert property.evaluatedValue == 150000.00

    # Teste com valores vazios
    property_data = {
        "minBid": "",
        "evaluatedValue": None
    }
    property = Property(**property_data)
    assert property.minBid is None
    assert property.evaluatedValue is None

    # Teste com valores inválidos
    property_data = {
        "minBid": "abc",
        "evaluatedValue": "xyz"
    }
    property = Property(**property_data)
    assert property.minBid is None
    assert property.evaluatedValue is None

def test_parse_date():
    """Testa a validação de campos de data"""
    # Teste com data válida
    property_data = {
        "auctionDate": "2024-05-07T23:00:00Z"
    }
    property = Property(**property_data)
    assert isinstance(property.auctionDate, datetime)
    assert property.auctionDate.year == 2024
    assert property.auctionDate.month == 5
    assert property.auctionDate.day == 7

    # Teste com data vazia
    property_data = {
        "auctionDate": ""
    }
    property = Property(**property_data)
    assert property.auctionDate is None

    # Teste com data inválida
    property_data = {
        "auctionDate": "data-invalida"
    }
    property = Property(**property_data)
    assert property.auctionDate is None

def test_property_creation():
    """Testa a criação completa de um imóvel"""
    property_data = {
        "title": "Imóvel Teste",
        "description": "Descrição do imóvel",
        "address": "Rua Teste, 123",
        "city": "São Paulo",
        "state": "SP",
        "propertyType": "Residencial",
        "auctionType": "Leilão",
        "minBid": "100.000,00",
        "evaluatedValue": "150.000,00",
        "auctionDate": "2024-05-07T23:00:00Z",
        "images": ["image1.jpg", "image2.jpg"],
        "documents": ["doc1.pdf"],
        "auctions": [],
        "extractionStatus": "success"
    }
    
    property = Property(**property_data)
    
    assert property.title == "Imóvel Teste"
    assert property.description == "Descrição do imóvel"
    assert property.address == "Rua Teste, 123"
    assert property.city == "São Paulo"
    assert property.state == "SP"
    assert property.propertyType == "Residencial"
    assert property.auctionType == "Leilão"
    assert property.minBid == 100000.00
    assert property.evaluatedValue == 150000.00
    assert isinstance(property.auctionDate, datetime)
    assert len(property.images) == 2
    assert len(property.documents) == 1
    assert len(property.auctions) == 0
    assert property.extractionStatus == "success"

def test_property_default_values():
    """Testa os valores padrão do modelo Property"""
    property = Property()
    
    assert property.title == ""
    assert property.description == ""
    assert property.address == ""
    assert property.city == ""
    assert property.state == ""
    assert property.propertyType == ""
    assert property.auctionType == "Leilão"
    assert property.minBid is None
    assert property.evaluatedValue is None
    assert property.auctionDate is None
    assert isinstance(property.images, list)
    assert isinstance(property.documents, list)
    assert isinstance(property.auctions, list)
    assert property.extractionStatus == "success" 