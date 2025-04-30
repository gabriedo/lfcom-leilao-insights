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

class FilaBase(BaseModel):
    nome: str
    acao: str  # enqueue, dequeue, process
    status: str = "pendente"  # pendente, processando, concluido, erro
    dados: Optional[Dict[str, Any]] = None
    prioridade: int = 0
    tentativas: int = 0
    erro: Optional[str] = None

class FilaCreate(FilaBase):
    pass

class FilaUpdate(BaseModel):
    status: Optional[str] = None
    tentativas: Optional[int] = None
    erro: Optional[str] = None

class FilaInDB(FilaBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    processado_em: Optional[datetime] = None
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

class Fila(FilaInDB):
    pass 