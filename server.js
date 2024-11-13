const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Criar app do express
const app = express();

// Configurar o servidor para lidar com dados JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar a sessão
app.use(session({
  secret: 'secreta_chave', // Escolha uma chave secreta
  resave: false,
  saveUninitialized: true
}));

// Configurar a conexão com o banco de dados MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sua_senha', // Substitua pela sua senha
  database: 'chat_app'
});

// Verificar a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.log('Erro de conexão com o banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados MariaDB');
  }
});

// Rota para registrar um novo usuário
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Nome de usuário e senha são obrigatórios');
  }

  // Verificar se o nome de usuário já existe
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Erro no banco de dados');
    }

    if (results.length > 0) {
      return res.status(400).send('Usuário já existe');
    }

    // Criptografar a senha
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).send('Erro ao criptografar a senha');
      }

      // Inserir novo usuário no banco
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          return res.status(500).send('Erro ao registrar o usuário');
        }
        res.status(201).send('Usuário registrado com sucesso');
      });
    });
  });
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Nome de usuário e senha são obrigatórios');
  }

  // Verificar se o usuário existe
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Erro no banco de dados');
    }

    if (results.length === 0) {
      return res.status(400).send('Usuário não encontrado');
    }

    // Comparar a senha fornecida com a senha criptografada
    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Erro ao verificar a senha');
      }

      if (!isMatch) {
        return res.status(400).send('Senha incorreta');
      }

      // Iniciar a sessão do usuário
      req.session.user = results[0];
      res.status(200).send('Login bem-sucedido');
    });
  });
});

// Rota de logout
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao fazer logout');
    }
    res.status(200).send('Logout realizado');
  });
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});