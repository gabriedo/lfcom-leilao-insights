import logging
from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from ..config import MongoDB

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

class PreAnalysisLogBase(BaseModel):
    url: str
    status: str
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class PreAnalysisLogCreate(PreAnalysisLogBase):
    pass

class PreAnalysisLog(PreAnalysisLogBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }
    )
    
    @classmethod
    async def find_one(cls, filter: Dict[str, Any]) -> Optional["PreAnalysisLog"]:
        """
        Busca um documento no MongoDB.
        Args:
            filter: Filtro para a busca
        Returns:
            PreAnalysisLog ou None se não encontrado
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database not initialized")
            
            collection = db.pre_analysis_logs
            document = await collection.find_one(filter)
            
            if document:
                # Converte ObjectId para string
                document["_id"] = str(document["_id"])
                return cls(**document)
            return None
            
        except Exception as e:
            logger.error(f"Erro ao buscar documento: {str(e)}")
            raise
    
    @classmethod
    async def save(cls, data: PreAnalysisLogCreate) -> "PreAnalysisLog":
        """
        Salva um documento no MongoDB.
        Se já existir um documento com a mesma URL, atualiza-o.
        Args:
            data: Dados a serem salvos
        Returns:
            PreAnalysisLog salvo
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database not initialized")
            
            collection = db.pre_analysis_logs
            
            # Converte para dict e remove campos None
            data_dict = data.model_dump(exclude_none=True)
            
            # Atualiza ou insere o documento
            result = await collection.update_one(
                {"url": data.url},
                {"$set": data_dict},
                upsert=True
            )
            
            # Busca o documento atualizado
            if result.upserted_id:
                document = await collection.find_one({"_id": result.upserted_id})
            else:
                document = await collection.find_one({"url": data.url})
            
            if document is None:
                raise Exception("Document not found after save")
            
            # Converte ObjectId para string
            document["_id"] = str(document["_id"])
            return cls(**document)
            
        except Exception as e:
            logger.error(f"Erro ao salvar documento: {str(e)}")
            raise 