from datetime import datetime
from typing import List, Optional
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

class LeilaoBase(BaseModel):
    titulo: str
    descricao: str
    valor_inicial: float
    valor_minimo_incremento: float
    data_inicio: datetime
    data_fim: datetime
    categoria_id: PyObjectId
    imagens: List[str] = []
    ativo: bool = True

    @validator('valor_inicial')
    def validar_valor_inicial(cls, v):
        if v <= 0:
            raise ValueError('O valor inicial deve ser maior que zero')
        return round(v, 2)

    @validator('valor_minimo_incremento')
    def validar_valor_minimo_incremento(cls, v):
        if v <= 0:
            raise ValueError('O valor mínimo de incremento deve ser maior que zero')
        return round(v, 2)

    @validator('data_fim')
    def validar_data_fim(cls, v, values):
        if 'data_inicio' in values and v <= values['data_inicio']:
            raise ValueError('A data de fim deve ser posterior à data de início')
        return v

class LeilaoCreate(LeilaoBase):
    pass

class LeilaoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    valor_inicial: Optional[float] = None
    valor_minimo_incremento: Optional[float] = None
    data_inicio: Optional[datetime] = None
    data_fim: Optional[datetime] = None
    categoria_id: Optional[PyObjectId] = None
    imagens: Optional[List[str]] = None
    ativo: Optional[bool] = None

    @validator('valor_inicial')
    def validar_valor_inicial(cls, v):
        if v is not None and v <= 0:
            raise ValueError('O valor inicial deve ser maior que zero')
        return round(v, 2) if v is not None else v

    @validator('valor_minimo_incremento')
    def validar_valor_minimo_incremento(cls, v):
        if v is not None and v <= 0:
            raise ValueError('O valor mínimo de incremento deve ser maior que zero')
        return round(v, 2) if v is not None else v

    @validator('data_fim')
    def validar_data_fim(cls, v, values):
        if v is not None and 'data_inicio' in values and values['data_inicio'] is not None:
            if v <= values['data_inicio']:
                raise ValueError('A data de fim deve ser posterior à data de início')
        return v

class LeilaoInDB(LeilaoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    criado_por: PyObjectId
    status: str = "pendente"  # pendente, em_andamento, finalizado, cancelado
    valor_atual: float = Field(default_factory=lambda: 0.0)
    ultimo_lance: Optional[PyObjectId] = None
    total_lances: int = 0
    total_visualizacoes: int = 0

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Leilao(LeilaoInDB):
    pass 