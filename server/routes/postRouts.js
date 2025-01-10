const express = require('express');
const upload = require('../config//multer');  // Import multer configuration
const postController = require('../controllers/PostController');

const router = express.Router();

// POST route for creating a new post with image upload
router.post('/createPost', upload.single('image'), postController.createPost);
router.get('/:userId', postController.getPostsByUserId);
router.post('/updateLike', postController.updateLike);
router.post('/uniPost', postController.getUniPosts);
module.exports = router;
