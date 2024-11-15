#!/bin/bash

# Caminho do repositório
REPO_PATH="/data/data/com.termux/files/home/Chat-app"

while true; do
  # Navega até o diretório do repositório
  cd "$REPO_PATH" || exit

  echo "pullTime"

  # Executa o git pull
  git pull

  # Espera 10 segundos antes de rodar novamente
  sleep 10
done
