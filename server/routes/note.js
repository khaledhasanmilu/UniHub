const express = require('express');
const router = express.Router();
const {getNotes,createNote,updateNote,deleteNote} = require('../controllers/noteController');

const {uploadNotes} = require('../config/multer');
router.get('/getNotes/:universityId', getNotes);
router.post('/createNote',uploadNotes.single('file'), createNote);
router.put('/editNote/:id', updateNote);
router.delete('/deleteNote/:noteId', deleteNote);

module.exports = router;