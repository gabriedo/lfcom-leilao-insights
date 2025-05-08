# Documentação da API

## Visão Geral

A API do Leilão Insights fornece endpoints para análise e extração de dados de portais de leilão.

## Endpoints

### Extração de Dados

#### POST /api/extract

Extrai dados de um imóvel a partir de uma URL.

**Request:**
```json
{
    "url": "https://exemplo.com/imovel",
    "portal": "mega_leiloes"
}
```

**Response (200):**
```json
{
    "title": "Imóvel Teste",
    "price": "R$ 100.000,00",
    "address": "Rua Teste, 123",
    "city": "São Paulo",
    "state": "SP",
    "type": "Casa",
    "auction_date": "01/01/2024",
    "images": [
        "imagem1.jpg",
        "imagem2.jpg"
    ]
}
```

**Response (400):**
```json
{
    "error": "URL inválida",
    "details": "A URL deve começar com http:// ou https://"
}
```

**Response (404):**
```json
{
    "error": "Portal não suportado",
    "details": "O portal 'portal_invalido' não é suportado"
}
```

**Response (500):**
```json
{
    "error": "Erro ao extrair dados",
    "details": "Não foi possível acessar a página"
}
```

### Análise de Imóveis

#### POST /api/analyze

Analisa um imóvel e retorna insights.

**Request:**
```json
{
    "property": {
        "title": "Imóvel Teste",
        "price": "R$ 100.000,00",
        "address": "Rua Teste, 123",
        "city": "São Paulo",
        "state": "SP",
        "type": "Casa",
        "auction_date": "01/01/2024"
    }
}
```

**Response (200):**
```json
{
    "market_value": "R$ 150.000,00",
    "discount": "33.33%",
    "location_score": 8.5,
    "investment_potential": "Alto",
    "risks": [
        "Documentação pendente",
        "Valor acima do mercado"
    ]
}
```

**Response (400):**
```json
{
    "error": "Dados inválidos",
    "details": {
        "price": "O preço deve ser um número válido",
        "auction_date": "A data deve estar no formato DD/MM/YYYY"
    }
}
```

## Validações

### Campos Obrigatórios

- `url`: URL válida do imóvel
- `portal`: Portal suportado (mega_leiloes, zuk)
- `title`: Título do imóvel
- `price`: Preço em formato válido
- `address`: Endereço do imóvel
- `city`: Cidade
- `state`: Estado (2 caracteres)
- `type`: Tipo do imóvel
- `auction_date`: Data do leilão (DD/MM/YYYY)

### Formatos

#### Preço
- Aceita valores com ou sem R$
- Aceita pontos e vírgulas como separadores
- Exemplos válidos:
  - R$ 100.000,00
  - 100000.00
  - 100.000,00

#### Data
- Formato: DD/MM/YYYY
- Data deve ser válida
- Data não pode ser no passado

#### Estado
- 2 caracteres
- Apenas letras maiúsculas
- Deve ser um estado válido do Brasil

#### Tipo de Imóvel
- Valores permitidos:
  - Casa
  - Apartamento
  - Terreno
  - Comercial
  - Rural

## Tratamento de Erros

### Códigos de Erro

- 400: Dados inválidos
- 401: Não autorizado
- 403: Acesso negado
- 404: Recurso não encontrado
- 500: Erro interno

### Formato de Erro

```json
{
    "error": "Descrição do erro",
    "details": "Detalhes adicionais ou objeto com erros específicos"
}
```

## Rate Limiting

- 100 requisições por minuto por IP
- 1000 requisições por hora por IP

### Headers de Rate Limit

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1617235200
```

## Autenticação

### API Key

Adicione o header:
```
X-API-Key: sua-api-key
```

### JWT

Adicione o header:
```
Authorization: Bearer seu-token-jwt
```

## Versão

A versão atual da API é v1.

Para especificar a versão, use o header:
```
X-API-Version: 1
```

## Changelog

### v1.1.0
- Adicionada validação de preços
- Adicionada validação de datas
- Adicionada validação de estados
- Adicionada validação de tipos de imóvel

### v1.0.0
- Versão inicial da API
- Extração de dados básicos
- Análise de imóveis 