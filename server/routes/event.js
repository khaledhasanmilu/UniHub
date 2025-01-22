const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const {uploadImage} = require('../config/multer');
const router = express.Router();

router.post('/getEvent', getEvents);
router.post('/createEvent',uploadImage.single('image'), createEvent);
module.exports = router;