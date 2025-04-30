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

class TokenBase(BaseModel):
    token: str
    tipo: str  # access, refresh, reset_password, email_verification
    usuario_id: PyObjectId
    expira_em: datetime
    usado: bool = False

class TokenCreate(TokenBase):
    pass

class TokenUpdate(BaseModel):
    usado: bool = False

class TokenInDB(TokenBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    usado_em: Optional[datetime] = None
    ip: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Token(TokenInDB):
    pass 