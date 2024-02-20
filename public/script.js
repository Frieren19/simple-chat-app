const socket = io();

function sendMessage() {
  const user = document.getElementById('user').value;
  const message = document.getElementById('message').value;

  // Emit a chatMessage event to the server
  socket.emit('chatMessage', { user, message });

  // Clear the input fields
  document.getElementById('message').value = '';
}

// Listen for incoming messages from the server
socket.on('message', (data) => {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('p');
  messageElement.textContent = `${data.user}: ${data.message}`;
  chatBox.appendChild(messageElement);
});