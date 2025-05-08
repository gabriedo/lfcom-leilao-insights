# Documentação dos Extractors

## Visão Geral

Os extractors são responsáveis por extrair dados de diferentes portais de leilão. Cada extractor é especializado em um portal específico e implementa a interface definida pela classe base `BaseExtractor`.

## Estrutura

```
extractors/
├── __init__.py
├── base.py
├── mega_leiloes.py
└── zuk.py
```

### BaseExtractor

A classe base que define a interface comum para todos os extractors:

```python
class BaseExtractor:
    def extract(self, soup: BeautifulSoup) -> dict:
        """
        Extrai dados do HTML fornecido.
        
        Args:
            soup: Objeto BeautifulSoup com o HTML parseado
            
        Returns:
            dict: Dicionário com os dados extraídos
            
        Raises:
            Exception: Se não for possível extrair os dados
        """
        raise NotImplementedError
```

### MegaLeiloesExtractor

Extractor específico para o portal Mega Leilões:

```python
class MegaLeiloesExtractor(BaseExtractor):
    def extract(self, soup: BeautifulSoup) -> dict:
        """
        Extrai dados do HTML do Mega Leilões.
        
        Campos extraídos:
        - title: Título do imóvel
        - price: Preço do imóvel
        - address: Endereço
        - city: Cidade
        - state: Estado
        - type: Tipo do imóvel
        - auction_date: Data do leilão
        - images: Lista de URLs das imagens
        """
```

### ZukExtractor

Extractor específico para o portal Zuk:

```python
class ZukExtractor(BaseExtractor):
    def extract(self, soup: BeautifulSoup) -> dict:
        """
        Extrai dados do HTML do Zuk.
        
        Campos extraídos:
        - title: Título do imóvel
        - price: Preço do imóvel
        - location: Localização completa
        - type: Tipo do imóvel
        - auction_date: Data do leilão
        - documents: Lista de URLs dos documentos
        """
```

## Uso

```python
from bs4 import BeautifulSoup
from extractors.mega_leiloes import MegaLeiloesExtractor
from extractors.zuk import ZukExtractor

# HTML do Mega Leilões
html_mega = """
<div class="property-details">
    <h1>Imóvel Teste</h1>
    <p class="price">R$ 100.000,00</p>
    <p class="address">Rua Teste, 123</p>
    <p class="city">São Paulo</p>
    <p class="state">SP</p>
    <p class="type">Casa</p>
    <p class="auction-date">01/01/2024</p>
</div>
"""

# Extrai dados do Mega Leilões
soup = BeautifulSoup(html_mega, "html.parser")
extractor = MegaLeiloesExtractor()
data = extractor.extract(soup)

# HTML do Zuk
html_zuk = """
<div class="property-info">
    <h1>Imóvel Teste</h1>
    <div class="price">R$ 100.000,00</div>
    <div class="location">Rua Teste, 123 - São Paulo/SP</div>
    <div class="type">Casa</div>
    <div class="auction-date">01/01/2024</div>
</div>
"""

# Extrai dados do Zuk
soup = BeautifulSoup(html_zuk, "html.parser")
extractor = ZukExtractor()
data = extractor.extract(soup)
```

## Tratamento de Erros

Os extractors lançam exceções em casos de erro:

- HTML inválido ou vazio
- Campos obrigatórios ausentes
- Formato de dados inválido

Exemplo de tratamento de erros:

```python
try:
    data = extractor.extract(soup)
except Exception as e:
    print(f"Erro ao extrair dados: {e}")
```

## Testes

Os extractors possuem testes unitários que verificam:

- Extração de dados em diferentes formatos
- Tratamento de erros
- Validação de campos obrigatórios

Para executar os testes:

```bash
pytest tests/test_extractors.py
pytest tests/test_extractors_formats.py
```

## Adicionando um Novo Extractor

Para adicionar um novo extractor:

1. Crie um novo arquivo em `extractors/` com o nome do portal
2. Implemente a classe herdando de `BaseExtractor`
3. Implemente o método `extract()`
4. Adicione testes unitários
5. Atualize esta documentação

Exemplo:

```python
# extractors/novo_portal.py
from .base import BaseExtractor
from bs4 import BeautifulSoup

class NovoPortalExtractor(BaseExtractor):
    def extract(self, soup: BeautifulSoup) -> dict:
        # Implementação da extração
        pass
```

## Manutenção

Ao fazer alterações nos extractors:

1. Mantenha a compatibilidade com o formato de dados existente
2. Adicione testes para novos casos
3. Atualize a documentação
4. Verifique o impacto em outros componentes 