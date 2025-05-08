from fastapi import APIRouter
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Removido o endpoint '/proxy-image' para evitar duplicidade 