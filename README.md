# LFCom Leilão Insights

API para análise de imóveis em leilão, fornecendo insights e dados estruturados sobre propriedades disponíveis.

## Requisitos

- Python 3.8+
- MongoDB 4.4+
- Node.js 18.17.0 (para desenvolvimento)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/lfcom-leilao-insights.git
cd lfcom-leilao-insights
```

2. Crie e ative um ambiente virtual:
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

## Configuração

O arquivo `.env` deve conter as seguintes variáveis:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=leilao_insights
```

## Executando a API

1. Inicie o MongoDB:
```bash
mongod --dbpath /path/to/data/db
```

2. Inicie a API:
```bash
uvicorn backend.main:app --reload --port 8001
```

A API estará disponível em `http://localhost:8001`

## Endpoints

### Pré-análise

- `GET /api/pre-analysis/{url}`: Retorna a análise prévia de uma URL
- `POST /api/pre-analysis`: Inicia uma nova análise prévia
- `GET /api/analysis-results/{url}`: Retorna os resultados da análise completa

## Desenvolvimento

### Estrutura do Projeto

```
.
├── backend/
│   ├── models/         # Modelos Pydantic
│   ├── routers/        # Rotas da API
│   ├── services/       # Serviços de negócio
│   ├── utils/          # Utilitários
│   └── main.py         # Aplicação FastAPI
├── tests/              # Testes
├── .env.example        # Exemplo de configuração
├── requirements.txt    # Dependências Python
└── README.md          # Este arquivo
```

### Testes

Para executar os testes:

```bash
pytest
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
