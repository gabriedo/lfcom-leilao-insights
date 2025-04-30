from datetime import datetime
from typing import Optional
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

class ArquivoBase(BaseModel):
    nome: str
    tipo: str  # imagem, documento, video, etc
    tamanho: int  # em bytes
    url: str
    mime_type: str
    leilao_id: Optional[PyObjectId] = None
    usuario_id: Optional[PyObjectId] = None
    ativo: bool = True

class ArquivoCreate(ArquivoBase):
    pass

class ArquivoUpdate(BaseModel):
    nome: Optional[str] = None
    ativo: Optional[bool] = None

class ArquivoInDB(ArquivoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    criado_por: PyObjectId
    atualizado_por: Optional[PyObjectId] = None
    hash: Optional[str] = None
    metadata: Optional[dict] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Arquivo(ArquivoInDB):
    pass 