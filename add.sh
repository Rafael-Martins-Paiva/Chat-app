#!/bin/bash

# Adiciona todas as alterações
git add .

# Solicita a mensagem de commit
read -p "Digite a mensagem do commit: " commit_message

# Realiza o commit
git commit -m "$commit_message"

# Pergunta se o usuário quer dar um push
read -p "Deseja dar push? (s/n): " push_option

# Se o usuário escolher "s", realiza o push
if [[ "$push_option" == "s" || "$push_option" == "S" ]]; then
    git push
    echo "Push realizado com sucesso!"
else
    echo "Push cancelado."
fi
