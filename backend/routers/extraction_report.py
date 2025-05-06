from fastapi import APIRouter, HTTPException
from typing import Optional
from ..models.extraction_report import ExtractionReport, ExtractionLog
from ..config import MongoDB
import logging
from datetime import datetime
from urllib.parse import urlparse

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/extraction-report", response_model=ExtractionReport)
async def get_extraction_report():
    """
    Retorna um relatório detalhado das extrações realizadas.
    """
    try:
        db = MongoDB.get_database()
        collection = db.extraction_logs

        # Total de extrações
        total = await collection.count_documents({})

        # Extrações por portal
        pipeline_portal = [
            {
                "$group": {
                    "_id": {
                        "portal": {
                            "$let": {
                                "vars": {
                                    "url": "$url"
                                },
                                "in": {
                                    "$cond": {
                                        "if": {"$regexMatch": {"input": "$url", "regex": "portalzuk"}},
                                        "then": "portalzuk.com.br",
                                        "else": {
                                            "$cond": {
                                                "if": {"$regexMatch": {"input": "$url", "regex": "megaleiloes"}},
                                                "then": "megaleiloes.com.br",
                                                "else": {
                                                    "$cond": {
                                                        "if": {"$regexMatch": {"input": "$url", "regex": "caixa"}},
                                                        "then": "leiloes.caixa.gov.br",
                                                        "else": "outros"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "count": {"$sum": 1}
                }
            }
        ]
        portal_results = await collection.aggregate(pipeline_portal).to_list(length=None)
        por_portal = {r["_id"]["portal"]: r["count"] for r in portal_results}

        # Extrações por status
        pipeline_status = [
            {
                "$group": {
                    "_id": "$status",
                    "count": {"$sum": 1}
                }
            }
        ]
        status_results = await collection.aggregate(pipeline_status).to_list(length=None)
        por_status = {r["_id"]: r["count"] for r in status_results}

        # Últimos logs
        cursor = collection.find().sort("timestamp", -1).limit(10)
        ultimos_logs = []
        async for doc in cursor:
            ultimos_logs.append(ExtractionLog(
                url=doc["url"],
                status=doc["status"],
                missing_fields=doc.get("missing_fields"),
                timestamp=doc["timestamp"]
            ))

        return ExtractionReport(
            total=total,
            por_portal=por_portal,
            por_status=por_status,
            ultimos_logs=ultimos_logs
        )

    except Exception as e:
        logger.error(f"Erro ao gerar relatório de extração: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/debug/logs")
async def get_debug_logs(portal: Optional[str] = None):
    """
    Retorna os últimos 50 logs de extração, opcionalmente filtrados por portal.
    """
    try:
        db = MongoDB.get_database()
        collection = db.extraction_logs

        query = {}
        if portal:
            query["url"] = {"$regex": portal, "$options": "i"}

        cursor = collection.find(query).sort("timestamp", -1).limit(50)
        logs = []
        async for doc in cursor:
            logs.append({
                "url": doc["url"],
                "status": doc["status"],
                "missing_fields": doc.get("missing_fields"),
                "timestamp": doc["timestamp"].isoformat()
            })

        return logs

    except Exception as e:
        logger.error(f"Erro ao buscar logs de debug: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 