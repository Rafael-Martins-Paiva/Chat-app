const socket = io();
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');

socket.on('chat message', (msg) => {
  const message = document.createElement('div');
  message.textContent = msg;
  messagesDiv.appendChild(message);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

document.getElementById('chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value;
  socket.emit('chat message', msg);
  messageInput.value = '';
});