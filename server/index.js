const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');  // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating authentication tokens

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());
// MySQL Database Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'unihub', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.execute('SELECT 1', (err, results) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});


// User Registration (Sign Up) Route
app.post('/api/register', (req, res) => {
  const { name, email, userType, password, university } = req.body;
  console.log(req.body);
  if (!name || !email || !userType || !password || !university) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const query = 'INSERT INTO users (name, email, usertype, password, university) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [name, email, userType, hashedPassword, university], (err, results) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).json({ message: 'Failed to register user' });
      }

      res.status(201).json({ success: 'User registered successfully!' });
    });
  });
});


// User Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.execute(query, [email], (err, results) => {
    if (err) {
      console.error('Error querying user from database:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const user = results[0];

    // Compare password with the stored hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password.' });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });

      res.status(200).json({ success: 'Login successful', token });
    });
  });
});

// User Logout Route (Clear Token)
app.post('/api/logout', (req, res) => {
  // In a simple implementation, just send a response saying the user has logged out
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/unilist', (req, res) => {
  // Example data, replace with actual logic
  const universities = [
    { id: 1, name: 'United International University' },
    { id: 2, name: 'Dhaka International University' },
  ];
  res.json(universities); // Return JSON response
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
