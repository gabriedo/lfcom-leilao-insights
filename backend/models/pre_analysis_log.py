from datetime import datetime
from typing import Optional, Any
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler: Any) -> dict[str, Any]:
        return {
            'type': 'str',
            'description': 'ObjectId',
            'custom_validator': lambda x: ObjectId(x) if isinstance(x, str) else x
        }

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