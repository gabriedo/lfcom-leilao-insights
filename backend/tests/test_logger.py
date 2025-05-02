import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.utils.logger import log_url
from backend.app.models.url_log import URLLogCreate
from backend.app.db.mongodb import mongodb
import os
from dotenv import load_dotenv

# Carrega variáveis de ambiente
load_dotenv()

# URL de teste do MongoDB
TEST_MONGODB_URL = os.getenv("TEST_MONGODB_URL", "mongodb://localhost:27017")
TEST_DB_NAME = "test_leilao_insights"

@pytest.fixture(autouse=True)
async def setup_database():
    """Configura o banco de dados de teste antes de cada teste"""
    # Conecta ao banco de teste
    mongodb.client = AsyncIOMotorClient(TEST_MONGODB_URL)
    mongodb.db = mongodb.client[TEST_DB_NAME]
    
    # Limpa a coleção antes de cada teste
    await mongodb.db.url_logs.delete_many({})
    
    yield
    
    # Limpa a coleção após cada teste
    await mongodb.db.url_logs.delete_many({})
    # Fecha a conexão
    mongodb.client.close()

@pytest.mark.asyncio
async def test_log_url_duplicate_prevention():
    """Testa se a função log_url evita duplicidade de URLs"""
    # Dados de teste
    test_url = "https://exemplo.com/imovel/123"
    test_domain = "exemplo.com"
    test_status = "confiável"
    
    # Cria o primeiro log
    log_data = URLLogCreate(
        url=test_url,
        dominio=test_domain,
        status=test_status
    )
    
    # Insere o primeiro log
    first_log = await log_url(log_data)
    assert first_log is not None
    assert first_log.url == test_url
    
    # Tenta inserir o mesmo log novamente
    second_log = await log_url(log_data)
    assert second_log is not None
    assert second_log.url == test_url
    
    # Verifica se só existe um registro no banco
    count = await mongodb.db.url_logs.count_documents({})
    assert count == 1, "Deve existir apenas um registro no banco"
    
    # Verifica se o segundo log retornado é o mesmo do primeiro
    assert second_log.id == first_log.id, "O segundo log deve retornar o mesmo registro do primeiro" 