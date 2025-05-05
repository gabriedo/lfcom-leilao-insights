from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging
import signal
import sys
import psutil
import traceback

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do logging
logger = logging.getLogger(__name__)

# Configurações do MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGODB_DB", "leilao_insights")

class MongoDB:
    """
    Classe para gerenciar a conexão com o MongoDB.
    """
    _client = None
    _database = None
    
    @classmethod
    async def connect(cls) -> None:
        """
        Estabelece conexão com o MongoDB.
        """
        try:
            if cls._client is None:
                logger.info(f"Conectando ao MongoDB: {MONGODB_URL}")
                cls._client = AsyncIOMotorClient(MONGODB_URL)
                cls._database = cls._client[DATABASE_NAME]
                
                # Testa a conexão
                await cls._client.admin.command("ping")
                logger.info("Conexão com MongoDB estabelecida com sucesso")
                
        except Exception as e:
            logger.error(f"Erro ao conectar com MongoDB: {str(e)}")
            raise
    
    @classmethod
    async def close(cls) -> None:
        """
        Fecha a conexão com o MongoDB.
        """
        try:
            if cls._client is not None:
                logger.info("Fechando conexão com MongoDB...")
                cls._client.close()
                cls._client = None
                cls._database = None
                logger.info("Conexão com MongoDB fechada com sucesso")
                
        except Exception as e:
            logger.error(f"Erro ao fechar conexão com MongoDB: {str(e)}")
            raise
    
    @classmethod
    def get_database(cls):
        """
        Retorna a instância do banco de dados.
        """
        if cls._database is None:
            raise Exception("Database not initialized")
        return cls._database
    
    @classmethod
    async def create_indexes(cls) -> None:
        """
        Cria os índices necessários nas coleções.
        """
        try:
            if cls._database is None:
                raise Exception("Database not initialized")
            
            # Índices para pre_analysis_logs
            await cls._database.pre_analysis_logs.create_index("url", unique=True)
            await cls._database.pre_analysis_logs.create_index("status")
            await cls._database.pre_analysis_logs.create_index("created_at")
            
            # Índices para extraction_results
            await cls._database.extraction_results.create_index("url", unique=True, name="url_unique")
            await cls._database.extraction_results.create_index("status")
            await cls._database.extraction_results.create_index("created_at")
            
            # Índices para url_logs
            await cls._database.url_logs.create_index("url", unique=True)
            await cls._database.url_logs.create_index("status")
            await cls._database.url_logs.create_index("created_at")
            
            logger.info("Índices criados com sucesso")
            
        except Exception as e:
            logger.error(f"Erro ao criar índices: {str(e)}")
            raise

def check_port_in_use(port: int) -> bool:
    """
    Verifica se uma porta está em uso.
    """
    try:
        for proc in psutil.process_iter(['pid', 'name', 'connections']):
            try:
                for conn in proc.connections():
                    if conn.laddr.port == port:
                        return True
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
        return False
    except Exception as e:
        error_msg = f"Erro ao verificar porta {port}: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        raise Exception(error_msg)

def kill_process_on_port(port: int) -> None:
    """
    Mata o processo que está usando uma porta específica.
    """
    try:
        for proc in psutil.process_iter(['pid', 'name', 'connections']):
            try:
                for conn in proc.connections():
                    if conn.laddr.port == port:
                        os.kill(proc.pid, signal.SIGTERM)
                        logger.info(f"Processo {proc.pid} usando a porta {port} foi encerrado")
                        return
            except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                pass
    except Exception as e:
        error_msg = f"Erro ao matar processo na porta {port}: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        raise Exception(error_msg)

def signal_handler(signum, frame):
    """
    Handler para sinais de encerramento.
    """
    try:
        logger.info("Recebido sinal de encerramento")
        if MongoDB._client:
            MongoDB._client.close()
            logger.info("Conexão com MongoDB fechada")
        sys.exit(0)
    except Exception as e:
        error_msg = f"Erro ao tratar sinal de encerramento: {str(e)}"
        logger.error(f"{error_msg}\n{traceback.format_exc()}")
        sys.exit(1)

# Registra os handlers de sinal
signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler) 