const path = require("path");
const db = require("../config/db");

// Handle creating a post
const createPost = (req, res) => {
  const { content, creator_id, university_only } = req.body;

  // Check if the image was uploaded, if not, set imageUrl to null
  const imageUrl = req.file
    ? `http://localhost:5000/uploads/images/${req.file.filename}`
    : null;
  console.log(creator_id);
  // Insert post into the database (assuming you're using MySQL)
  const query =
    "INSERT INTO posts (creator_id, content, imageUrl, created_at) VALUES (?, ?, ?, NOW())";
  db.execute(query, [creator_id, content, imageUrl], (err, result) => {
    if (err) {
      console.error("Error saving post to database:", err.message); // Log error message for better debugging
      return res
        .status(500)
        .json({ message: "Error saving post", error: err.message });
    }

    // Optional: Add more data to response if needed
    console.log("Post created with ID:", result.insertId);

    res.status(201).json({
      message: "Post created successfully",
      postId: result.insertId,
      content,
      imageUrl, // You can also return image URL in the response if needed
    });
  });
};

// Fetch posts by creator_id
const getPostsByUserId = (req, res) => {
  const { userId } = req.params; // Get creator_id from URL parameters

  // SQL query to fetch posts by creator_id, including the user name and profile picture
  const query = `SELECT 
    posts.post_id, 
    posts.content,
    posts.imageUrl, 
    posts.created_at, 
    posts.creator_id,
    users.name AS creator_name, 
    users.profile_picture, 
    COUNT(DISTINCT likes.like_id) AS like_count,
    COUNT(DISTINCT CASE WHEN likes.user_id = ? THEN 1 ELSE NULL END) AS user_liked,
    COUNT(DISTINCT comments.comment_id) AS comment_count
FROM posts
JOIN users ON posts.creator_id = users.user_id
LEFT JOIN likes ON posts.post_id = likes.post_id
LEFT JOIN comments on posts.post_id = comments.post_id
WHERE posts.creator_id = ?
GROUP BY posts.post_id, posts.content, posts.created_at, users.name, users.profile_picture
ORDER BY posts.created_at DESC;
`;
  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ message: "Error fetching posts" });
    }

    // If no posts are found
    if (results.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    // Send posts in response
    res.status(200).json({
      success: true,
      posts: results, // Send the posts fetched from the database
    });
  });
};

const updateLike = (req, res) => {
  const { postId, userId, liked } = req.body;
  console.log(postId, userId, liked);

  if (!liked) {
    // If the user is unliking, delete the like
    const query = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
    db.execute(query, [postId, userId], (err, result) => {
      if (err) {
        console.error("Error deleting like:", err.message);
        return res
          .status(500)
          .json({ message: "Error deleting like", error: err.message });
      }
      res.status(200).json({ message: "Like deleted successfully" });
    });
  } else {
    // Check if the user already liked the post
    const checkQuery = "SELECT * FROM likes WHERE post_id = ? AND user_id = ?";
    db.execute(checkQuery, [postId, userId], (err, results) => {
      if (err) {
        console.error("Error checking like:", err.message);
        return res
          .status(500)
          .json({ message: "Error checking like", error: err.message });
      }

      if (results.length > 0) {
        // User has already liked this post
        return res
          .status(400)
          .json({ message: "User has already liked this post" });
      }

      // Insert the like
      const insertQuery = "INSERT INTO likes (post_id, user_id) VALUES (?, ?)";
      db.execute(insertQuery, [postId, userId], (err, result) => {
        if (err) {
          console.error("Error inserting like:", err.message);
          return res
            .status(500)
            .json({ message: "Error inserting like", error: err.message });
        }
        res.status(200).json({ message: "Like inserted successfully" });
      });
    });
  }
};


const getUniPosts = (req, res) => {
  const { user_id, university } = req.body;
  const query = `
    SELECT 
    posts.post_id, 
    posts.content,
    posts.imageUrl, 
    posts.created_at, 
    posts.creator_id,
    users.name AS creator_name, 
    users.profile_picture, 
    COUNT(DISTINCT likes.like_id) AS like_count, -- Count all likes for the post
    COUNT(DISTINCT CASE WHEN likes.user_id = ? THEN likes.like_id ELSE NULL END) AS user_liked, -- Check if user with ID 4 liked the post
    COUNT(DISTINCT comments.comment_id) AS comment_count -- Count all comments for the post
FROM posts
JOIN users ON posts.creator_id = users.user_id
LEFT JOIN likes ON posts.post_id = likes.post_id
LEFT JOIN comments ON posts.post_id = comments.post_id
WHERE posts.creator_id = ? OR users.university_id = ?
GROUP BY posts.post_id, posts.content, posts.imageUrl, posts.created_at, users.name, users.profile_picture
ORDER BY posts.created_at DESC;
  `;

  db.query(query, [user_id,user_id, university], (err, result) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ message: "Error fetching posts" });
    }

    if (result.length === 0) {
      console.log("No posts found for the given criteria.");
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json({
      success: true,
      posts: result,
    });
  });
};

const addComment = (req, res) => {
  const { postId, userId, content } = req.body;

  const query = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
  db.execute(query, [postId, userId, content], (err, result) => {
    if (err) {
      console.error("Error saving comment to database:", err.message);
      return res.status(500).json({ message: "Error saving comment", error: err.message });
    }

    res.status(201).json({
      message: "Comment added successfully",
      commentId: result.insertId,
      content,
    });
  });
};

module.exports = {
  createPost,
  getPostsByUserId,
  updateLike,
  getUniPosts,
  addComment
};
