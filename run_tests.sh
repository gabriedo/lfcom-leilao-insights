#!/bin/bash
echo "✅ Executando testes com PYTHONPATH definido corretamente..."
PYTHONPATH=. pytest backend/tests --maxfail=5 --disable-warnings -v 