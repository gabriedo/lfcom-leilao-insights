"""
Pacote routers
"""
from .pre_analysis import router as pre_analysis_router
from .extraction_report import router as extraction_report_router
from .proxy import router as proxy_router
from .analysis import router as analysis_router
from .proxy_html import router as proxy_html_router
from .proxy_image import router as proxy_image_router

__all__ = [
    'pre_analysis_router',
    'extraction_report_router',
    'proxy_router',
    'analysis_router',
    'proxy_html_router',
    'proxy_image_router',
] 