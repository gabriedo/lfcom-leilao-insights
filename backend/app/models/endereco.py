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

class EnderecoBase(BaseModel):
    cep: str
    logradouro: str
    numero: str
    complemento: Optional[str] = None
    bairro: str
    cidade: str
    estado: str
    pais: str = "Brasil"
    tipo: str = "residencial"  # residencial, comercial, entrega
    principal: bool = False
    usuario_id: PyObjectId

    @validator('cep')
    def validar_cep(cls, v):
        # Remove caracteres não numéricos
        cep = ''.join(filter(str.isdigit, v))
        
        if len(cep) != 8:
            raise ValueError('CEP deve conter 8 dígitos')
            
        return cep

    @validator('estado')
    def validar_estado(cls, v):
        estados = [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
            'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
        ]
        if v.upper() not in estados:
            raise ValueError('Estado inválido')
        return v.upper()

class EnderecoCreate(EnderecoBase):
    pass

class EnderecoUpdate(BaseModel):
    cep: Optional[str] = None
    logradouro: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    pais: Optional[str] = None
    tipo: Optional[str] = None
    principal: Optional[bool] = None

    @validator('cep')
    def validar_cep(cls, v):
        if v is not None:
            # Remove caracteres não numéricos
            cep = ''.join(filter(str.isdigit, v))
            
            if len(cep) != 8:
                raise ValueError('CEP deve conter 8 dígitos')
                
            return cep
        return v

    @validator('estado')
    def validar_estado(cls, v):
        if v is not None:
            estados = [
                'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
            ]
            if v.upper() not in estados:
                raise ValueError('Estado inválido')
            return v.upper()
        return v

class EnderecoInDB(EnderecoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    ativo: bool = True

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Endereco(EnderecoInDB):
    pass 