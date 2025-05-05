from datetime import datetime
from typing import Optional, Any, Dict, List
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

class ExtractionResult(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    url: str
    status: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    error: Optional[str] = None
    result: Optional[dict] = None

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
    async def find_one(cls, filter_dict: dict) -> Optional['ExtractionResult']:
        """
        Busca um documento no MongoDB usando o filtro especificado.
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database não inicializado")
                
            collection = db.extraction_results
            document = await collection.find_one(filter_dict)
            
            if document:
                # Converte o ObjectId para string
                document['_id'] = str(document['_id'])
                return cls(**document)
            return None
        except Exception as e:
            raise Exception(f"Erro ao buscar documento: {str(e)}")

    async def save(self) -> 'ExtractionResult':
        """
        Salva o documento no MongoDB.
        """
        try:
            db = MongoDB.get_database()
            if db is None:
                raise Exception("Database não inicializado")
                
            collection = db.extraction_results
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

class ExtractionResultCreate(BaseModel):
    url: str
    status: str
    error: Optional[str] = None
    result: Optional[dict] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    )

    async def save(self) -> ExtractionResult:
        """
        Cria um novo documento ExtractionResult no MongoDB.
        """
        try:
            extraction_result = ExtractionResult(
                url=self.url,
                status=self.status,
                error=self.error,
                result=self.result
            )
            return await extraction_result.save()
        except Exception as e:
            raise Exception(f"Erro ao criar documento: {str(e)}")

class ExtractionResultInDB(ExtractionResult):
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        from_attributes=True
    ) 