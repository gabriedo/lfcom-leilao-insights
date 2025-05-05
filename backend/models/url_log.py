from datetime import datetime
from typing import Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId
from ..config import MongoDB

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        if not isinstance(v, str):
            raise TypeError('string required')
        if not ObjectId.is_valid(v):
            raise ValueError('invalid ObjectId')
        return str(v)

class URLLog(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    url: str
    status: int
    dominio: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_encoders={
            ObjectId: str,
            datetime: lambda v: v.isoformat()
        },
        populate_by_name=True,
        arbitrary_types_allowed=True,
        from_attributes=True
    )

    @classmethod
    async def find_one(cls, filter_dict: dict) -> Optional['URLLog']:
        """
        Busca um documento no MongoDB usando o filtro especificado.
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database não inicializado")
                
            collection = db.url_logs
            document = await collection.find_one(filter_dict)
            
            if document:
                # Converte o ObjectId para string
                document['_id'] = str(document['_id'])
                return cls(**document)
            return None
        except Exception as e:
            raise Exception(f"Erro ao buscar documento: {str(e)}")

    async def save(self) -> 'URLLog':
        """
        Salva o documento no MongoDB.
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database não inicializado")
                
            collection = db.url_logs
            data = self.model_dump(by_alias=True, exclude={'id'})
            
            if not self.id:
                result = await collection.insert_one(data)
                self.id = str(result.inserted_id)
            else:
                await collection.update_one(
                    {'_id': ObjectId(self.id)},
                    {'$set': data}
                )
            return self
        except Exception as e:
            raise Exception(f"Erro ao salvar documento: {str(e)}")

class URLLogCreate(BaseModel):
    url: str
    status: int
    dominio: str

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )

    async def save(self) -> URLLog:
        """
        Cria um novo documento URLLog no MongoDB.
        """
        try:
            url_log = URLLog(
                url=self.url,
                status=self.status,
                dominio=self.dominio
            )
            return await url_log.save()
        except Exception as e:
            raise Exception(f"Erro ao criar documento: {str(e)}")

class URLLogInDB(URLLog):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    ) 