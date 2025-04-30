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

class LogBase(BaseModel):
    nivel: str  # info, warning, error, debug
    mensagem: str
    modulo: str
    acao: str
    usuario_id: Optional[PyObjectId] = None
    dados: Optional[Dict[str, Any]] = None

class LogCreate(LogBase):
    pass

class LogInDB(LogBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    ip: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Log(LogInDB):
    pass 