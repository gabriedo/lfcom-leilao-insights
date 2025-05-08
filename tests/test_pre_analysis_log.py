import pytest
from datetime import datetime
from backend.models.pre_analysis_log import PreAnalysisLog, PreAnalysisLogCreate, PyObjectId

def test_pre_analysis_log_creation():
    # Testa a criação de um log com todos os campos
    log = PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="completed",
        result={
            "titulo": "Casa 3 Quartos",
            "valor_minimo": "R$ 500.000,00"
        },
        error=None
    )
    
    assert log.url == "https://exemplo.com/imovel"
    assert log.status == "completed"
    assert log.result["titulo"] == "Casa 3 Quartos"
    assert log.result["valor_minimo"] == "R$ 500.000,00"
    assert log.error is None
    assert isinstance(log.id, PyObjectId)
    assert isinstance(log.created_at, datetime)
    assert isinstance(log.updated_at, datetime)

def test_pre_analysis_log_create():
    # Testa a criação de um log com campos mínimos
    log = PreAnalysisLogCreate(
        url="https://exemplo.com/imovel",
        status="pending"
    )
    
    assert log.url == "https://exemplo.com/imovel"
    assert log.status == "pending"
    assert log.result is None
    assert log.error is None

def test_pre_analysis_log_with_error():
    # Testa a criação de um log com erro
    log = PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="error",
        result=None,
        error="Erro ao acessar URL"
    )
    
    assert log.url == "https://exemplo.com/imovel"
    assert log.status == "error"
    assert log.result is None
    assert log.error == "Erro ao acessar URL"

def test_py_object_id():
    # Testa a criação e validação de ObjectId
    obj_id = PyObjectId()
    assert isinstance(obj_id, PyObjectId)
    
    # Testa a validação de string
    obj_id = PyObjectId.validate("507f1f77bcf86cd799439011")
    assert isinstance(obj_id, PyObjectId)
    
    # Testa a validação de ObjectId existente
    existing_id = PyObjectId()
    obj_id = PyObjectId.validate(existing_id)
    assert isinstance(obj_id, PyObjectId)
    assert obj_id == existing_id

def test_pre_analysis_log_json():
    # Testa a serialização para JSON
    log = PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="completed",
        result={"titulo": "Casa"},
        error=None
    )
    
    json_data = log.model_dump()
    assert isinstance(json_data["id"], str)
    assert isinstance(json_data["created_at"], str)
    assert isinstance(json_data["updated_at"], str)
    assert json_data["url"] == "https://exemplo.com/imovel"
    assert json_data["status"] == "completed"
    assert json_data["result"]["titulo"] == "Casa"
    assert json_data["error"] is None 