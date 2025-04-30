from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, validator
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

class LanceBase(BaseModel):
    valor: float
    leilao_id: PyObjectId
    usuario_id: PyObjectId

    @validator('valor')
    def validar_valor(cls, v):
        if v <= 0:
            raise ValueError('O valor do lance deve ser maior que zero')
        return round(v, 2)

class LanceCreate(LanceBase):
    pass

class LanceUpdate(BaseModel):
    valor: Optional[float] = None

    @validator('valor')
    def validar_valor(cls, v):
        if v is not None and v <= 0:
            raise ValueError('O valor do lance deve ser maior que zero')
        return round(v, 2) if v is not None else v

class LanceInDB(LanceBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pendente"  # pendente, aceito, rejeitado
    observacao: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Lance(LanceInDB):
    pass 