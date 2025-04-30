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

class IntegracaoBase(BaseModel):
    servico: str  # nome do serviço externo
    acao: str  # request, response, error
    metodo: str  # GET, POST, PUT, DELETE, etc
    url: str
    status: int  # código HTTP
    tempo_resposta: float  # em segundos
    request_data: Optional[Dict[str, Any]] = None
    response_data: Optional[Dict[str, Any]] = None
    erro: Optional[str] = None

class IntegracaoCreate(IntegracaoBase):
    pass

class IntegracaoInDB(IntegracaoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    usuario_id: Optional[PyObjectId] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Integracao(IntegracaoInDB):
    pass 