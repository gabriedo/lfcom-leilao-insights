import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from backend.main import app
from backend.models.pre_analysis_log import PreAnalysisLog

client = TestClient(app)

@pytest.fixture
def mock_analysis():
    return PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="completed",
        result={
            "titulo": "Casa 3 Quartos em Leilão",
            "valor_minimo": "R$ 500.000,00",
            "imagem": "https://exemplo.com/imagem.jpg",
            "data_leilao": "2024-03-01"
        },
        error=None
    )

def test_get_pre_analysis_success(mock_analysis):
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=mock_analysis):
        response = client.get("/api/pre-analysis/https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["url"] == mock_analysis.url
        assert data["status"] == mock_analysis.status
        assert data["result"] == mock_analysis.result

def test_get_pre_analysis_not_found():
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=None):
        response = client.get("/api/pre-analysis/https://exemplo.com/imovel")
        assert response.status_code == 404
        assert response.json()["detail"] == "Análise não encontrada"

def test_create_pre_analysis_success():
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=None), \
         patch('backend.models.pre_analysis_log.PreAnalysisLogCreate.save') as mock_save, \
         patch('backend.services.analysis_service.analyze_property') as mock_analyze:
        
        mock_save.return_value = PreAnalysisLog(
            url="https://exemplo.com/imovel",
            status="pending",
            result=None,
            error=None
        )
        
        response = client.post("/api/pre-analysis?url=https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Análise iniciada"
        assert data["status"] == "pending"
        
        mock_analyze.assert_called_once_with("https://exemplo.com/imovel")

def test_create_pre_analysis_already_exists(mock_analysis):
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=mock_analysis):
        response = client.post("/api/pre-analysis?url=https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Análise já existe"
        assert data["status"] == mock_analysis.status

def test_get_analysis_results_success(mock_analysis):
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=mock_analysis):
        response = client.get("/api/analysis-results/https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "completed"
        assert data["result"] == mock_analysis.result

def test_get_analysis_results_pending():
    pending_analysis = PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="pending",
        result=None,
        error=None
    )
    
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=pending_analysis):
        response = client.get("/api/analysis-results/https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "pending"
        assert data["message"] == "Análise em andamento"

def test_get_analysis_results_error():
    error_analysis = PreAnalysisLog(
        url="https://exemplo.com/imovel",
        status="error",
        result=None,
        error="Erro ao acessar URL"
    )
    
    with patch('backend.models.pre_analysis_log.PreAnalysisLog.find_one', return_value=error_analysis):
        response = client.get("/api/analysis-results/https://exemplo.com/imovel")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "error"
        assert data["error"] == error_analysis.error
        assert data["result"] is None 