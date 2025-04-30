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

class WebhookBase(BaseModel):
    url: str
    evento: str
    metodo: str = "POST"
    headers: Optional[Dict[str, str]] = None
    payload: Optional[Dict[str, Any]] = None
    status: str = "pendente"  # pendente, enviado, erro
    status_code: Optional[int] = None
    resposta: Optional[Dict[str, Any]] = None
    erro: Optional[str] = None

class WebhookCreate(WebhookBase):
    pass

class WebhookUpdate(BaseModel):
    status: Optional[str] = None
    status_code: Optional[int] = None
    resposta: Optional[Dict[str, Any]] = None
    erro: Optional[str] = None

class WebhookInDB(WebhookBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    enviado_em: Optional[datetime] = None
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

class Webhook(WebhookInDB):
    pass 