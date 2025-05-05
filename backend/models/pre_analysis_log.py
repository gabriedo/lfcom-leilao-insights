from datetime import datetime
from typing import Optional, Any, Annotated
from pydantic import BaseModel, Field, ConfigDict, GetJsonSchemaHandler, GetCoreSchemaHandler
from pydantic.json_schema import JsonSchemaValue
from pydantic_core import CoreSchema, core_schema
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        _source_type: Any,
        _handler: GetCoreSchemaHandler
    ) -> CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(ObjectId),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x), return_schema=core_schema.str_schema()
            ),
        )

class PreAnalysisLog(BaseModel):
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
        arbitrary_types_allowed=True
    )

class PreAnalysisLogCreate(BaseModel):
    url: str
    status: str
    error: Optional[str] = None
    result: Optional[dict] = None

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )

class PreAnalysisLogInDB(PreAnalysisLog):
    model_config = ConfigDict(
        arbitrary_types_allowed=True
    ) 