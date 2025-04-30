from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr, validator
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

class UsuarioBase(BaseModel):
    nome: str
    email: EmailStr
    cpf: str
    telefone: Optional[str] = None
    ativo: bool = True
    tipo: str = "cliente"  # cliente, admin, corretor

    @validator('cpf')
    def validar_cpf(cls, v):
        # Remove caracteres não numéricos
        cpf = ''.join(filter(str.isdigit, v))
        
        if len(cpf) != 11:
            raise ValueError('CPF deve conter 11 dígitos')
            
        # Verifica se todos os dígitos são iguais
        if cpf == cpf[0] * 11:
            raise ValueError('CPF inválido')
            
        # Validação do primeiro dígito verificador
        soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
        digito1 = (soma * 10 % 11) % 10
        if int(cpf[9]) != digito1:
            raise ValueError('CPF inválido')
            
        # Validação do segundo dígito verificador
        soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
        digito2 = (soma * 10 % 11) % 10
        if int(cpf[10]) != digito2:
            raise ValueError('CPF inválido')
            
        return cpf

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    telefone: Optional[str] = None
    ativo: Optional[bool] = None
    tipo: Optional[str] = None
    senha: Optional[str] = None

class UsuarioInDB(UsuarioBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    senha_hash: str
    criado_em: datetime = Field(default_factory=datetime.utcnow)
    atualizado_em: datetime = Field(default_factory=datetime.utcnow)
    ultimo_login: Optional[datetime] = None
    leiloes_favoritos: List[PyObjectId] = []
    leiloes_participados: List[PyObjectId] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat()
        }

class Usuario(UsuarioInDB):
    pass 