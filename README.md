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

## Setup e execução local

### 1. Variáveis de ambiente
- Duplique o arquivo `.env.example` para `.env` na raiz.
- Preencha no `.env`:
  ```env
  MONGO_URL=<sua_connection_string_do_mongo>
  CAIXA_API_KEY=<sua_api_key_da_caixa>
  VITE_API_URL=http://localhost:8000/caixa
  ```

### 2. Backend (FastAPI)
```

### 3. Testes do Backend

Para rodar todos os testes do backend, utilize um dos comandos abaixo na raiz do projeto:

```bash
./run_tests.sh
# ou
make test
```