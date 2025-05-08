# Script de Limpeza de Portas

## Visão Geral

O script `clean_ports.sh` é responsável por limpar processos que estão utilizando portas específicas, evitando conflitos ao iniciar novos serviços.

## Uso

```bash
# Limpa todas as portas padrão
./clean_ports.sh

# Limpa portas específicas
./clean_ports.sh 3000 3001 3002

# Limpa portas em um intervalo
./clean_ports.sh 3000-3005
```

## Portas Padrão

O script limpa as seguintes portas por padrão:

- 3000: Frontend (React)
- 8000: Backend (FastAPI)
- 27017: MongoDB
- 5173-5175: Vite Dev Server

## Exemplos

### Limpar todas as portas padrão

```bash
./clean_ports.sh
```

### Limpar portas específicas

```bash
./clean_ports.sh 3000 8000
```

### Limpar intervalo de portas

```bash
./clean_ports.sh 3000-3005
```

### Limpar portas e mostrar detalhes

```bash
./clean_ports.sh -v
```

## Opções

- `-v`: Modo verboso, mostra detalhes dos processos
- `-f`: Força a limpeza sem confirmação
- `-h`: Mostra ajuda

## Integração com o Desenvolvimento

### VS Code

Adicione a seguinte configuração ao seu `tasks.json`:

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Clean Ports",
            "type": "shell",
            "command": "./clean_ports.sh",
            "problemMatcher": []
        }
    ]
}
```

### Scripts NPM

Adicione ao seu `package.json`:

```json
{
    "scripts": {
        "clean-ports": "./clean_ports.sh",
        "dev": "npm run clean-ports && vite",
        "start": "npm run clean-ports && vite build && vite preview"
    }
}
```

## Troubleshooting

### Erro de Permissão

Se você receber um erro de permissão:

```bash
chmod +x clean_ports.sh
```

### Processo não Encontrado

Se um processo não for encontrado, verifique:

1. Se a porta está realmente em uso
2. Se você tem permissão para ver o processo
3. Se o processo está em outro usuário

### Processo não Pode ser Encerrado

Se um processo não puder ser encerrado:

1. Verifique se você tem permissão de root
2. Tente encerrar manualmente
3. Reinicie o sistema se necessário

## Boas Práticas

1. Execute o script antes de iniciar novos serviços
2. Use o modo verboso para debug
3. Mantenha o script atualizado com novas portas
4. Documente novas portas adicionadas

## Contribuindo

Para adicionar novas portas ou funcionalidades:

1. Edite o script
2. Adicione testes
3. Atualize esta documentação
4. Crie um pull request

## Segurança

O script requer permissões de root para encerrar processos. Use com cautela e apenas em ambientes de desenvolvimento. 