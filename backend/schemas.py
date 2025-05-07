from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PreAnalysisResponse(BaseModel):
    title: str = Field(default="")
    minBid: str = Field(default="")
    propertyType: str = Field(default="")
    address: str = Field(default="")
    city: str = Field(default="")
    state: str = Field(default="")
    evaluatedValue: str = Field(default="")
    auctionDate: str = Field(default="")
    documentCount: int = Field(default=0)
    bidCount: int = Field(default=0)
    images: List[str] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)
    extractionStatus: str = Field(default="failed")
    description: Optional[str] = Field(default="")
    auctionType: str = Field(default="Leilão")
    auctions: List[dict] = Field(default_factory=list)
    url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Apartamento 25 m² - Vila Madalena - São Paulo - SP",
                "minBid": "495.992,07",
                "propertyType": "Apartamento",
                "address": "Rua Exemplo, 123, Vila Madalena, São Paulo, SP",
                "city": "São Paulo",
                "state": "SP",
                "evaluatedValue": "500.000,00",
                "auctionDate": "2025-04-14",
                "documentCount": 3,
                "bidCount": 0,
                "images": ["https://exemplo.com/imagem1.jpg"],
                "documents": ["https://exemplo.com/edital.pdf"],
                "extractionStatus": "success"
            }
        } 