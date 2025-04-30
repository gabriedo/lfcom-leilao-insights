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

class ConfiguracaoBase(BaseModel):
    chave: str
    valor: Any
    descricao: Optional[str] = None
    tipo: str = "string"  # string, number, boolean, json
    grupo: str = "geral"  # geral, email, pagamento, etc
    ativo: bool = True

class ConfiguracaoCreate(ConfiguracaoBase):
    pass

class ConfiguracaoUpdate(BaseModel):
    valor: Optional[Any] = None
    descricao: Optional[str] = None
    tipo: Optional[str] = None
    grupo: Optional[str] = None
    ativo: Optional[bool] = None

class ConfiguracaoInDB(ConfiguracaoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    criado_por: PyObjectId
    atualizado_por: Optional[PyObjectId] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Configuracao(ConfiguracaoInDB):
    pass 