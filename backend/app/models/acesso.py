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

class AcessoBase(BaseModel):
    usuario_id: PyObjectId
    tipo: str  # login, logout, token_refresh, password_reset, etc
    ip: str
    user_agent: str
    status: str = "sucesso"  # sucesso, erro
    mensagem: Optional[str] = None
    dados: Optional[Dict[str, Any]] = None

class AcessoCreate(AcessoBase):
    pass

class AcessoInDB(AcessoBase):
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

class Acesso(AcessoInDB):
    pass 