# Leilão Insights

Sistema de análise e monitoramento de leilões do B3.

## Estrutura do Projeto

```
leilao-insights/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── api/            # Rotas da API
│   │   ├── core/           # Configurações e utilitários
│   │   ├── models/         # Modelos de dados
│   │   └── services/       # Lógica de negócio
│   ├── tests/              # Testes automatizados
│   ├── .env.example        # Exemplo de variáveis de ambiente
│   └── requirements.txt    # Dependências Python
└── frontend/               # Interface React
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── pages/         # Páginas da aplicação
    │   ├── services/      # Serviços e integrações
    │   └── utils/         # Utilitários
    ├── public/            # Arquivos estáticos
    └── package.json       # Dependências Node.js
```

## Requisitos

- Python 3.8+
- Node.js 16+
- MongoDB 4.4+

## Configuração do Ambiente

### Backend

1. Crie um ambiente virtual Python:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Instale as dependências:
```bash
cd backend
pip install -r requirements.txt
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
uvicorn app.main:app --reload
```

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Funcionalidades

- Monitoramento em tempo real de leilões
- Análise de dados históricos
- Alertas e notificações
- Dashboard interativo
- Exportação de relatórios

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
