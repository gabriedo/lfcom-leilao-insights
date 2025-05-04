from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime

class URLLogBase(BaseModel):
    url: str
    dominio: str
    status: str
    dados_extraidos: Optional[Dict[str, Any]] = None
    timestamp: datetime = datetime.utcnow()

class URLLogCreate(URLLogBase):
    pass

class URLLog(URLLogBase):
    id: str

    class Config:
        from_attributes = True 