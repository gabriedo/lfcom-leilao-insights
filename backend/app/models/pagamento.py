from datetime import datetime
from typing import Optional, Dict, Any
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

class PagamentoBase(BaseModel):
    valor: float
    tipo: str  # boleto, cartao, pix, transferencia
    status: str = "pendente"  # pendente, aprovado, rejeitado, cancelado
    leilao_id: PyObjectId
    usuario_id: PyObjectId
    metodo_pagamento: str  # credito, debito, pix, boleto
    parcelas: int = 1
    dados_pagamento: Optional[Dict[str, Any]] = None

    @validator('valor')
    def validar_valor(cls, v):
        if v <= 0:
            raise ValueError('O valor deve ser maior que zero')
        return round(v, 2)

    @validator('parcelas')
    def validar_parcelas(cls, v):
        if v < 1:
            raise ValueError('O número de parcelas deve ser maior que zero')
        return v

class PagamentoCreate(PagamentoBase):
    pass

class PagamentoUpdate(BaseModel):
    status: Optional[str] = None
    dados_pagamento: Optional[Dict[str, Any]] = None

class PagamentoInDB(PagamentoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    aprovado_em: Optional[datetime] = None
    cancelado_em: Optional[datetime] = None
    rejeitado_em: Optional[datetime] = None
    codigo_transacao: Optional[str] = None
    codigo_autorizacao: Optional[str] = None
    mensagem_erro: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Pagamento(PagamentoInDB):
    pass 