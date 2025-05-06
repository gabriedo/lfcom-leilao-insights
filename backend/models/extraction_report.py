from typing import Dict, List, Optional
from pydantic import BaseModel
from datetime import datetime

class ExtractionLog(BaseModel):
    url: str
    status: str
    missing_fields: Optional[List[str]] = None
    timestamp: datetime

class ExtractionReport(BaseModel):
    total: int
    por_portal: Dict[str, int]
    por_status: Dict[str, int]
    ultimos_logs: List[ExtractionLog] 