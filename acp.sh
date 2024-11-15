#!/bin/bash

# Exibe as branches disponíveis e permite selecionar uma
echo "Branches disponíveis:"
git branch --all

# Solicita ao usuário a branch desejada
read -p "Digite o nome da branch para commit (ou pressione Enter para manter a atual): " branch_name

# Troca para a branch especificada, se fornecida
if [[ -n "$branch_name" ]]; then
    git checkout "$branch_name" || exit 1
fi

# Adiciona todas as alterações
git add .

# Solicita a mensagem do commit
read -p "Digite a mensagem do commit: " commit_message

# Realiza o commit
git commit -m "$commit_message"

# Pergunta se o usuário quer dar um push
read -p "Deseja dar push? (s/n): " push_option

# Realiza o push, se solicitado
if [[ "$push_option" == "s" || "$push_option" == "S" ]]; then
    git push
    echo "Push realizado com sucesso!"
else
    echo "Push cancelado."
fi
