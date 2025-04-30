from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class URLLog(BaseModel):
    url: str
    status: int
    dominio: str
    timestamp: datetime

    model_config = ConfigDict(
        json_encoders={
            datetime: lambda v: v.isoformat()
        }
    ) 