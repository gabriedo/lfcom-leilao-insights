import pytest
from datetime import datetime
from backend.models.pre_analysis_log import PreAnalysisLog, PreAnalysisLogCreate
from backend.config import MongoDB

@pytest.fixture
async def db():
    """Fixture para configurar o banco de dados de teste"""
    await MongoDB.connect()
    yield MongoDB.get_database()
    await MongoDB.close()

@pytest.mark.asyncio
async def test_pre_analysis_log_creation(db):
    """Testa a criação de um log de pré-análise"""
    log_data = {
        "url": "https://exemplo.com/imovel",
        "status": "pending",
        "data": {
            "title": "Imóvel Teste",
            "price": "100.000,00"
        }
    }
    
    log = PreAnalysisLogCreate(**log_data)
    saved_log = await log.save()
    
    assert saved_log.url == log_data["url"]
    assert saved_log.status == log_data["status"]
    assert saved_log.data == log_data["data"]
    assert isinstance(saved_log.created_at, datetime)
    assert isinstance(saved_log.updated_at, datetime)

@pytest.mark.asyncio
async def test_pre_analysis_log_update(db):
    """Testa a atualização de um log de pré-análise"""
    # Cria um log inicial
    log_data = {
        "url": "https://exemplo.com/imovel",
        "status": "pending"
    }
    
    log = PreAnalysisLogCreate(**log_data)
    saved_log = await log.save()
    
    # Atualiza o log
    saved_log.status = "completed"
    saved_log.data = {"result": "success"}
    updated_log = await saved_log.save()
    
    assert updated_log.url == log_data["url"]
    assert updated_log.status == "completed"
    assert updated_log.data == {"result": "success"}
    assert updated_log.created_at < updated_log.updated_at

@pytest.mark.asyncio
async def test_pre_analysis_log_find_one(db):
    """Testa a busca de um log de pré-análise"""
    # Cria um log para buscar
    log_data = {
        "url": "https://exemplo.com/imovel-unico",
        "status": "pending"
    }
    
    log = PreAnalysisLogCreate(**log_data)
    await log.save()
    
    # Busca o log
    found_log = await PreAnalysisLog.find_one({"url": log_data["url"]})
    
    assert found_log is not None
    assert found_log.url == log_data["url"]
    assert found_log.status == log_data["status"]

@pytest.mark.asyncio
async def test_pre_analysis_log_error_handling(db):
    """Testa o tratamento de erros no log de pré-análise"""
    # Testa com URL inválida
    log_data = {
        "url": "",  # URL inválida
        "status": "pending"
    }
    
    with pytest.raises(Exception):
        log = PreAnalysisLogCreate(**log_data)
        await log.save()
    
    # Testa com status inválido
    log_data = {
        "url": "https://exemplo.com/imovel",
        "status": "invalid_status"  # Status inválido
    }
    
    with pytest.raises(Exception):
        log = PreAnalysisLogCreate(**log_data)
        await log.save()

@pytest.mark.asyncio
async def test_pre_analysis_log_cleanup(db):
    """Testa a limpeza de logs antigos"""
    # Cria logs com diferentes datas
    old_log = PreAnalysisLogCreate(
        url="https://exemplo.com/imovel-antigo",
        status="completed",
        created_at=datetime(2023, 1, 1)
    )
    await old_log.save()
    
    new_log = PreAnalysisLogCreate(
        url="https://exemplo.com/imovel-novo",
        status="pending"
    )
    await new_log.save()
    
    # Busca logs recentes
    recent_logs = await PreAnalysisLog.find_one({"created_at": {"$gte": datetime(2024, 1, 1)}})
    
    assert recent_logs is not None
    assert recent_logs.url == new_log.url 