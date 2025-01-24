const express = require('express');
const router = express.Router();
const {getNotes,createNote,updateNote,deleteNote} = require('../controllers/noteController');
const {uploadNotes} = require('../config/multer');
router.get('/getNotes', getNotes);
router.post('/createNote',uploadNotes.single('file'), createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;