const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth');
const universityRoutes = require('./routes/university');
const postRoutes = require('./routes/postRouts');
const eventRoutes = require('./routes/event');
const jobRoutes = require('./routes/Job');
const userRoutes = require('./routes/user');
const noteRoutes = require('./routes/note');

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json({ limit: '10mb' })); // Set JSON body limit to 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Set URL-encoded body limit to 10MB
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization',  // Allowed request headers
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
app.use('/api/post',postRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/job',jobRoutes);
app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
