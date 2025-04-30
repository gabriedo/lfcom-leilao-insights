from datetime import datetime
from typing import Optional, Dict, Any, List
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

class AlertaBase(BaseModel):
    nome: str
    descricao: str
    nivel: str  # info, warning, error, critical
    tipo: str  # sistema, negocio, seguranca, etc
    status: str = "pendente"  # pendente, resolvido, ignorado
    metricas: Optional[List[Dict[str, Any]]] = None
    condicao: Optional[Dict[str, Any]] = None
    acoes: Optional[List[Dict[str, Any]]] = None

class AlertaCreate(AlertaBase):
    pass

class AlertaUpdate(BaseModel):
    status: Optional[str] = None
    resolucao: Optional[str] = None

class AlertaInDB(AlertaBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    resolvido_em: Optional[datetime] = None
    resolvido_por: Optional[PyObjectId] = None
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

class Alerta(AlertaInDB):
    pass 