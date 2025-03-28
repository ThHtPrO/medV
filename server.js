const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const path = require('path');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'MedVrobotics.html'));
});

// Store connected users
let users = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new user joining
  socket.on('newUser', (username) => {
    if (username) {
      socket.username = username;
      users.add(username);
      console.log('New user joined:', username);
      io.emit('userJoined', Array.from(users));
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove user from the set
    for (let user of users) {
      if (user === socket.username) {
        users.delete(user);
        io.emit('userLeft', user);
        break;
      }
    }
    io.emit('userJoined', Array.from(users));
  });

  // Handle new messages
  socket.on('sendMessage', (message) => {
    console.log('New message:', message);
    io.emit('newMessage', message);
  });

  // Handle new tasks
  socket.on('addTask', (taskData) => {
    console.log('New task added:', taskData);
    io.emit('newTask', taskData);
  });

  // Handle task deletions
  socket.on('deleteTask', (taskData) => {
    console.log('Task deleted:', taskData);
    io.emit('taskDeleted', taskData);
  });

  // Handle user kicks
  socket.on('kickUser', (username) => {
    // Find the socket of the user to kick
    const userSocket = Array.from(io.sockets.sockets.values())
      .find(s => s.username === username);
    
    if (userSocket) {
      // Emit kick event to the specific user
      userSocket.emit('userKicked', username);
      // Remove user from online users
      users.delete(username);
      // Update all clients about the user being kicked
      io.emit('userJoined', Array.from(users));
    }
  });
});

// Handle port conflicts
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

function startServer(port) {
  const server = http.listen(port, HOST, () => {
    console.log(`Server is running on http://${HOST}:${port}`);
    console.log('Other devices can connect using:');
    console.log(`http://192.168.0.113:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  http.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing server...');
  http.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 