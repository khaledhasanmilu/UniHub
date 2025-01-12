const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const upload = require('../config/multer');
const router = express.Router();

router.post('/getEvent', getEvents);
router.post('/createEvent',upload.single('image'), createEvent);
module.exports = router;