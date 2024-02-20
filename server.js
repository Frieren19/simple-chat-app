const express = require('express');
const http = require('http'); // Import the http module
const socketIO = require('socket.io');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app); // Create server using http module
const io = socketIO(server);

const port = 3000;
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat',
});





app.use(express.static('public'));

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.use(express.json());

app.post('/sendMessage', (req, res) => {
  const { user, message } = req.body;
  const insertQuery = 'INSERT INTO dbchat (user, message) VALUES (?, ?)';
  connection.query(insertQuery, [user, message], (err, results) => {
    if (err) {
      console.error('Error inserting message into database:', err);
      res.status(500).send('Error inserting message into database');
      return;
    }
    res.status(200).send('Message sent successfully');
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from clients
  socket.on('chatMessage', (data) => {
    const { user, message } = data;
    const insertQuery = 'INSERT INTO dbchat (user, message) VALUES (?, ?)';
    connection.query(insertQuery, [user, message], (err, results) => {
      if (err) {
        console.error('Error inserting message into database:', err);
        return;
      }
      // Broadcast the message to all connected clients
      io.emit('message', { user, message });
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});