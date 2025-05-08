#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Portas padrão
DEFAULT_PORTS=(3000 8000 27017 5173 5174 5175)

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [opções] [portas...]"
    echo
    echo "Opções:"
    echo "  -h    Mostra esta ajuda"
    echo "  -v    Modo verboso"
    echo "  -f    Força a limpeza sem confirmação"
    echo
    echo "Exemplos:"
    echo "  $0              # Limpa portas padrão"
    echo "  $0 3000 8000    # Limpa portas específicas"
    echo "  $0 3000-3005    # Limpa intervalo de portas"
    echo "  $0 -v           # Modo verboso"
}

# Função para verificar se um número é válido
is_valid_port() {
    local port=$1
    if [[ $port =~ ^[0-9]+$ ]] && [ $port -ge 1 ] && [ $port -le 65535 ]; then
        return 0
    else
        return 1
    fi
}

# Função para limpar uma porta
clean_port() {
    local port=$1
    local verbose=$2
    
    if ! is_valid_port $port; then
        echo -e "${RED}Porta inválida: $port${NC}"
        return 1
    fi
    
    # Encontra processos usando a porta
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -z "$pids" ]; then
        if [ "$verbose" = true ]; then
            echo -e "${YELLOW}Nenhum processo encontrado na porta $port${NC}"
        fi
        return 0
    fi
    
    # Mata os processos
    for pid in $pids; do
        if [ "$verbose" = true ]; then
            echo -e "${YELLOW}Encerrando processo $pid na porta $port${NC}"
        fi
        
        kill -9 $pid 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Processo $pid encerrado${NC}"
        else
            echo -e "${RED}Falha ao encerrar processo $pid${NC}"
        fi
    done
}

# Função para processar intervalo de portas
process_port_range() {
    local range=$1
    local verbose=$2
    
    if [[ $range =~ ^([0-9]+)-([0-9]+)$ ]]; then
        local start=${BASH_REMATCH[1]}
        local end=${BASH_REMATCH[2]}
        
        if [ $start -gt $end ]; then
            echo -e "${RED}Intervalo inválido: $range${NC}"
            return 1
        fi
        
        for port in $(seq $start $end); do
            clean_port $port $verbose
        done
    else
        echo -e "${RED}Formato de intervalo inválido: $range${NC}"
        return 1
    fi
}

# Variáveis
VERBOSE=false
FORCE=false
PORTS=()

# Processa argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        *)
            PORTS+=("$1")
            shift
            ;;
    esac
done

# Se nenhuma porta foi especificada, usa as padrão
if [ ${#PORTS[@]} -eq 0 ]; then
    PORTS=("${DEFAULT_PORTS[@]}")
fi

# Confirmação
if [ "$FORCE" = false ]; then
    echo -e "${YELLOW}As seguintes portas serão limpas:${NC}"
    for port in "${PORTS[@]}"; do
        echo -e "  - $port"
    done
    read -p "Continuar? (s/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${YELLOW}Operação cancelada${NC}"
        exit 0
    fi
fi

# Limpa as portas
for port in "${PORTS[@]}"; do
    if [[ $port =~ ^[0-9]+-[0-9]+$ ]]; then
        process_port_range $port $VERBOSE
    else
        clean_port $port $VERBOSE
    fi
done

echo -e "${GREEN}Limpeza concluída${NC}" 