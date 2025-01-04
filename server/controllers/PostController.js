const path = require('path');
const db = require('../config/db');

// Handle creating a post
const createPost = (req, res) => {
    const { content, userId } = req.body;

    // Check if the image was uploaded, if not, set imageUrl to null
    const imageUrl = req.file ? `http://localhost:5000/uploads/images/${req.file.filename}` : null;

    // Insert post into the database (assuming you're using MySQL)
    const query = 'INSERT INTO Posts (userId, content, imageUrl) VALUES (?, ?, ?)';
    db.execute(query, [userId, content, imageUrl], (err, result) => {
        if (err) {
            console.error('Error saving post to database:', err.message); // Log error message for better debugging
            return res.status(500).json({ message: 'Error saving post', error: err.message });
        }

        // Optional: Add more data to response if needed
        console.log('Post created with ID:', result.insertId);
        
        res.status(201).json({ 
            message: 'Post created successfully',
            postId: result.insertId,
            content,
            imageUrl // You can also return image URL in the response if needed
        });
    });
};


const getPostsByUserId = (req, res) => {
    const { userId } = req.params; // Get userId from URL parameters
 
    // SQL query to fetch posts by userId
    const query = 'SELECT Posts.*, users.name, users.userImage FROM Posts JOIN users ON Posts.UserId = users.Id ORDER BY Posts.CreatedAt DESC';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching posts:', err);
        return res.status(500).json({ message: 'Error fetching posts' });
      }
  
      // If no posts are found
      if (results.length === 0) {
        return res.status(404).json({ message: 'No posts found for this user' });
      }
  
      // Send posts in response
      res.status(200).json({
        success: true,
        posts: results,  // Send the posts fetched from the database
      });
    });
  };

module.exports = {
    createPost,getPostsByUserId,
};
