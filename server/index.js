const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const universityRoutes = require('./routes/university');
const postRoutes = require('./routes/postRouts');
const eventRoutes = require('./routes/event');
const jobRoutes = require('./routes/Job');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');
const alumniRoutes = require('./routes/alumni');
const chatRoutes = require('./routes/chat');
const teamRoutes = require('./routes/team');

const app = express();
const http = require('http');
const server = http.createServer(app);  // Use HTTP server for WebSockets
const { Server } = require('socket.io');
const PORT = 5000;

// WebSocket Server Setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Allow frontend requests
    credentials: true,
  }
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(cookieParser());

// Test the database connection
db.execute('SELECT 1', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to the MySQL database!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/post', postRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/team', teamRoutes);
// WebSocket Events





let users = {}; // Store users and their socket IDs

// Serve static files if needed, for example: app.use(express.static('public'));

// Listen for new connections
io.on('connection', (socket) => {
  console.log('New user connected', socket.id);

  // Register user with their socket ID
  socket.on('registerUser', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Handle sending message
  socket.on('sendMessage', ({ sender, receiver, text }) => {
    const messageData = { sender, receiver, text, timestamp: new Date() };
    console.log(`Sending message from ${sender} to ${receiver}:`, messageData);

    const query = 'INSERT INTO messages (sender_id, receiver_id, text, timestamp) VALUES (?, ?, ?, ?);';
    // Check if receiver is connected
    if (users[receiver]) {
      // Send the message only to the receiver
      db.query(query, [sender, receiver, text, messageData.timestamp], (err) => {
        if (err) {
          console.error('Error saving message:', err);
        }else{
          io.to(users[receiver]).emit('receiveMessage', messageData);
          console.log('Message saved successfully');
        }
      });
      
    }else{
      console.log('User is not connected');
      db.query(query, [sender, receiver, text, messageData.timestamp], (err) => {
        if (err) {
          console.error('Error saving message:', err);
        }else{
          console.log('Message saved successfully');
        }
      });
    }

  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    // Remove the user from the registered list
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});






// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the WebSocket-Enabled Server
server.listen(PORT,() => {
  console.log(`Server running on http://localhost:${PORT}`);
});
