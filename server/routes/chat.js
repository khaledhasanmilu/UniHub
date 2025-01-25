const express = require('express');
const router = express.Router();
const { getChat, getChatById,getUsersById } = require('../controllers/chatController');

router.get('/getChat',getChat);
router.get('/getChat/:id',getChatById);
router.get('/getUser/:id',getUsersById);

module.exports = router;