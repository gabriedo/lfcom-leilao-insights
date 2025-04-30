from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, EmailStr
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

class EmailBase(BaseModel):
    assunto: str
    destinatarios: List[EmailStr]
    template: str
    dados: Optional[Dict[str, Any]] = None
    status: str = "pendente"  # pendente, enviado, erro
    erro: Optional[str] = None

class EmailCreate(EmailBase):
    pass

class EmailUpdate(BaseModel):
    status: Optional[str] = None
    erro: Optional[str] = None

class EmailInDB(EmailBase):
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

class Email(EmailInDB):
    pass 