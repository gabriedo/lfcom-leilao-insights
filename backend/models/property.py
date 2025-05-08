from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from ..config import MongoDB
import logging
from pydantic import validator

logger = logging.getLogger(__name__)

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info):
        if isinstance(v, ObjectId):
            return str(v)
        if isinstance(v, str):
            if not ObjectId.is_valid(v):
                raise ValueError("Invalid ObjectId")
            return str(ObjectId(v))
        raise TypeError('ObjectId must be a string or ObjectId instance')

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema

class Property(BaseModel):
    """Modelo para representar um imóvel"""
    title: str = Field(default="")
    description: str = Field(default="")
    address: str = Field(default="")
    city: str = Field(default="")
    state: str = Field(default="")
    propertyType: str = Field(default="")
    auctionType: str = Field(default="Leilão")
    minBid: Optional[float] = Field(default=None)
    evaluatedValue: Optional[float] = Field(default=None)
    auctionDate: Optional[datetime] = Field(default=None)
    images: List[str] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)
    auctions: List[dict] = Field(default_factory=list)
    extractionStatus: str = Field(default="success")
    missingFields: List[str] = Field(default_factory=list)
    error: Optional[str] = None
    url: Optional[str] = None
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    @validator('minBid', 'evaluatedValue', pre=True)
    def parse_numeric_fields(cls, v):
        if v == "" or v is None:
            return None
        try:
            # Remove caracteres não numéricos exceto ponto e vírgula
            cleaned = ''.join(c for c in str(v) if c.isdigit() or c in '.,')
            # Substitui vírgula por ponto
            cleaned = cleaned.replace(',', '.')
            return float(cleaned)
        except (ValueError, TypeError):
            return None

    @validator('auctionDate', pre=True)
    def parse_date(cls, v):
        if v == "" or v is None:
            return None
        try:
            return datetime.fromisoformat(v.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            return None

    @classmethod
    async def find_one(cls, filter: Dict[str, Any]) -> Optional["Property"]:
        """
        Busca um documento no MongoDB.
        Args:
            filter: Filtro para a busca
        Returns:
            Property ou None se não encontrado
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database not initialized")
            
            collection = db.properties
            document = await collection.find_one(filter)
            
            if document:
                # Converte ObjectId para string
                document["_id"] = str(document["_id"])
                return cls(**document)
            return None
            
        except Exception as e:
            logger.error(f"Erro ao buscar documento: {str(e)}")
            raise

    async def save(self) -> "Property":
        """
        Salva o documento no MongoDB.
        Se já existir um documento com a mesma URL, atualiza-o.
        Returns:
            Property salvo
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database not initialized")
            
            collection = db.properties
            
            # Converte para dict e remove campos None
            data_dict = self.model_dump(exclude_none=True)
            
            # Atualiza ou insere o documento
            result = await collection.update_one(
                {"url": self.url},
                {"$set": data_dict},
                upsert=True
            )
            
            # Busca o documento atualizado
            if result.upserted_id:
                document = await collection.find_one({"_id": result.upserted_id})
            else:
                document = await collection.find_one({"url": self.url})
            
            if document is None:
                raise Exception("Document not found after save")
            
            # Converte ObjectId para string
            document["_id"] = str(document["_id"])
            return self.__class__(**document)
            
        except Exception as e:
            logger.error(f"Erro ao salvar documento: {str(e)}")
            raise

class PropertyCreate(Property):
    """Modelo para criação de um imóvel"""
    pass

class PropertyInDB(Property):
    """Modelo para imóvel no banco de dados"""
    pass 