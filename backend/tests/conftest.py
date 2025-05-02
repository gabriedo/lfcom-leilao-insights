import pytest
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

def pytest_configure(config):
    """Configuração global do pytest"""
    # Adiciona marcadores personalizados
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    ) 