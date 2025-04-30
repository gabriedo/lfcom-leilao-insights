from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class SegurancaBase(BaseModel):
    nivel: str  # info, warning, error, critical
    tipo: str  # autenticacao, autorizacao, validacao, etc
    mensagem: str
    usuario_id: Optional[PyObjectId] = None
    ip: str
    user_agent: str
    dados: Optional[Dict[str, Any]] = None

class SegurancaCreate(SegurancaBase):
    pass

class SegurancaInDB(SegurancaBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Seguranca(SegurancaInDB):
    pass 