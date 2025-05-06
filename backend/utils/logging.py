import logging
from typing import List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

def log_extraction_event(url: str, extraction_status: str, missing_fields: Optional[List[str]] = None) -> None:
    """
    Registra um evento de extração com detalhes sobre o status e campos ausentes.
    
    Args:
        url: URL do imóvel sendo extraído
        extraction_status: Status da extração (success, fallback_used, partial, failed)
        missing_fields: Lista de campos essenciais que não foram extraídos
    """
    missing = ", ".join(missing_fields) if missing_fields else "nenhum"
    logger.info(
        f"[EXTRACTION] URL: {url} | Status: {extraction_status} | "
        f"Campos ausentes: {missing} | Timestamp: {datetime.now().isoformat()}"
    ) 