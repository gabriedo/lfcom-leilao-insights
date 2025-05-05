# Leilão Insights - Backend

API para análise de propriedades em leilão.

## Requisitos

- Python 3.8+ (para desenvolvimento local)
- MongoDB 4.4+ (para desenvolvimento local)
- Docker e Docker Compose (para ambiente containerizado)
- Porta 8001 disponível

## Instalação

### Desenvolvimento Local

1. Clone o repositório
2. Crie um ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
.\venv\Scripts\activate  # Windows
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### Usando Docker

1. Clone o repositório
2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Inicie os containers:
```bash
docker-compose up -d
```

## Executando a API

### Desenvolvimento Local

1. Verifique se a porta 8001 está disponível:
```bash
# Linux/Mac
lsof -i :8001
# ou
netstat -an | grep 8001

# Windows
netstat -ano | findstr :8001
```

2. Se a porta estiver em uso, você pode matar o processo:
```bash
# Linux/Mac
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

3. Inicie a API:
```bash
uvicorn main:app --reload --port 8001
```

### Usando Docker

1. Inicie os containers:
```bash
docker-compose up -d
```

2. Para ver os logs:
```bash
docker-compose logs -f api
```

3. Para parar os containers:
```bash
docker-compose down
```

## Endpoints

### GET /pre-analysis/{url}
Obtém a pré-análise de uma propriedade em leilão.
Se não existir, inicia uma nova análise em background.

### POST /pre-analysis/{url}
Inicia uma nova pré-análise de uma propriedade em leilão.

### GET /health
Verifica a saúde da API e suas dependências.

## Estrutura do Projeto

```
backend/
├── models/              # Modelos Pydantic
├── routers/            # Rotas FastAPI
├── services/           # Serviços de negócio
├── utils/              # Utilitários
├── config.py           # Configurações
├── main.py            # Aplicação FastAPI
├── requirements.txt    # Dependências
├── Dockerfile         # Configuração do container
└── docker-compose.yml # Configuração do ambiente
```

## Extração de Dados

O sistema suporta extração de dados dos seguintes sites:
- Sodré Santoro (sodresantoro.com.br)
- Zuk (portalzuk.com.br)
- Mega Leilões (megaleiloes.com.br)

Para outros domínios, é usado um extrator genérico que tenta identificar os dados com base em padrões comuns.

## Logs

Os logs são salvos em `app.log` e incluem:
- Conexão com MongoDB
- Requisições à API
- Extração de dados
- Erros e exceções

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes. 