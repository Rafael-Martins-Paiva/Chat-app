// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurar o banco de dados MariaDB
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Erro de conexão com o banco de dados:', err);
    process.exit(1);
  }
  console.log('Conectado ao banco de dados MariaDB');
});

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Rota de login
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao verificar usuário');
    }

    const user = results[0];
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).send('Usuário ou senha incorretos');
    }

    req.session.userId = user.id;
    res.redirect('/chat');
  });
});

// Rota de chat
app.get('/chat', (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  res.sendFile(__dirname + '/public/chat.html');
});

// Conexão do Socket.IO
let currentUser = null;

io.on('connection', (socket) => {
  console.log('Novo usuário conectado');

  socket.on('login', (userId) => {
    currentUser = userId;
    socket.emit('user', userId);
  });

  socket.on('chat message', async (msg) => {
    if (!currentUser) return;

    db.query('INSERT INTO messages (sender_id, content) VALUES (?, ?)', [currentUser, msg], (err) => {
      if (err) {
        console.error('Erro ao salvar mensagem:', err);
        return;
      }
      io.emit('chat message', msg);
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado');
  });
});

// Rodar o servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});