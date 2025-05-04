import pytest
from unittest.mock import patch, MagicMock
from utils.pre_analysis_logger import save_pre_analysis
from models.pre_analysis_log import PreAnalysisLogCreate

@pytest.mark.asyncio
async def test_save_pre_analysis_success():
    with patch('models.pre_analysis_log.PreAnalysisLogCreate.save') as mock_save:
        # Configura o mock para retornar um objeto simulado
        mock_save.return_value = MagicMock(
            id="507f1f77bcf86cd799439011",
            url="https://exemplo.com/imovel",
            status="completed",
            result={"titulo": "Casa"},
            error=None
        )
        
        # Testa o salvamento com sucesso
        result = await save_pre_analysis(
            url="https://exemplo.com/imovel",
            status="completed",
            result={"titulo": "Casa"},
            error=None
        )
        
        assert result is not None
        assert result.url == "https://exemplo.com/imovel"
        assert result.status == "completed"
        assert result.result["titulo"] == "Casa"
        assert result.error is None
        
        # Verifica se o método save foi chamado
        mock_save.assert_called_once()

@pytest.mark.asyncio
async def test_save_pre_analysis_error():
    with patch('models.pre_analysis_log.PreAnalysisLogCreate.save') as mock_save:
        # Configura o mock para lançar uma exceção
        mock_save.side_effect = Exception("Erro ao salvar")
        
        # Testa o salvamento com erro
        with pytest.raises(Exception) as exc_info:
            await save_pre_analysis(
                url="https://exemplo.com/imovel",
                status="error",
                result=None,
                error="Erro ao acessar URL"
            )
        
        assert str(exc_info.value) == "Erro ao salvar"
        mock_save.assert_called_once()

@pytest.mark.asyncio
async def test_save_pre_analysis_pending():
    with patch('models.pre_analysis_log.PreAnalysisLogCreate.save') as mock_save:
        # Configura o mock para retornar um objeto simulado
        mock_save.return_value = MagicMock(
            id="507f1f77bcf86cd799439011",
            url="https://exemplo.com/imovel",
            status="pending",
            result=None,
            error=None
        )
        
        # Testa o salvamento com status pending
        result = await save_pre_analysis(
            url="https://exemplo.com/imovel",
            status="pending",
            result=None,
            error=None
        )
        
        assert result is not None
        assert result.url == "https://exemplo.com/imovel"
        assert result.status == "pending"
        assert result.result is None
        assert result.error is None
        
        # Verifica se o método save foi chamado
        mock_save.assert_called_once()

@pytest.mark.asyncio
async def test_save_pre_analysis_validation():
    # Testa a validação dos parâmetros
    with pytest.raises(ValueError) as exc_info:
        await save_pre_analysis(
            url="",  # URL vazia
            status="completed",
            result=None,
            error=None
        )
    
    assert "URL não pode ser vazia" in str(exc_info.value)
    
    with pytest.raises(ValueError) as exc_info:
        await save_pre_analysis(
            url="https://exemplo.com/imovel",
            status="invalid",  # Status inválido
            result=None,
            error=None
        )
    
    assert "Status inválido" in str(exc_info.value) 