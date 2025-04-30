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

class ErroBase(BaseModel):
    nivel: str  # error, warning, critical
    mensagem: str
    stack_trace: Optional[str] = None
    modulo: str
    usuario_id: Optional[PyObjectId] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    dados: Optional[Dict[str, Any]] = None
    resolvido: bool = False

class ErroCreate(ErroBase):
    pass

class ErroUpdate(BaseModel):
    resolvido: bool = False
    resolucao: Optional[str] = None

class ErroInDB(ErroBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    resolvido_em: Optional[datetime] = None
    resolvido_por: Optional[PyObjectId] = None
    resolucao: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Erro(ErroInDB):
    pass 