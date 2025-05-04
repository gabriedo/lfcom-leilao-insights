import pytest
import os
from dotenv import load_dotenv
import sys
from fastapi.testclient import TestClient
from main import app
from unittest.mock import AsyncMock, MagicMock
from config import MongoDB

# Carrega variáveis de ambiente
load_dotenv()

# Adiciona o diretório raiz ao PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

def pytest_configure(config):
    """Configuração global do pytest"""
    # Adiciona marcadores personalizados
    config.addinivalue_line(
        "markers", "asyncio: mark test as async"
    ) 

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture(autouse=True)
async def setup_test_environment():
    """Configura o ambiente de teste"""
    # Configura o mock do MongoDB
    mock_collection = AsyncMock()
    mock_collection.insert_one = AsyncMock()
    mock_collection.find_one = AsyncMock(return_value=None)

    mock_db = MagicMock()
    mock_db.url_logs = mock_collection

    # Configura o mock na classe MongoDB
    MongoDB.db = mock_db
    MongoDB.client = MagicMock()
    
    yield
    
    # Limpa os mocks após os testes
    MongoDB.db = None
    MongoDB.client = None