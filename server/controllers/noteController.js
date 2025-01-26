
const db = require('../config/db');

// Dummy notes data
let notes = [
    { 
        id: 1, 
        course: "CSE2201", 
        courseName: "Algebra Basics", 
        shortDescription: "Introduction to algebra.", 
        contentURL: "/uploads/algebra.pdf", 
        creatorId: "user_123", 
        universityId: "uni_001",
        createDate: "2025-01-15"
    },
    { 
        id: 2, 
        course: "Mathematics", 
        courseName: "Calculus I", 
        shortDescription: "Limits and derivatives.", 
        contentURL: "/uploads/calculus.pdf", 
        creatorId: "user_456", 
        universityId: "uni_002",
        createDate: "2025-01-16"
    }
];





const getNotes = (req, res) => {
    console.log(req.params);
    const universityId = req.params.universityId;
    const query = `SELECT notes.*, users.name AS creatorName FROM notes JOIN users ON notes.creator_id = users.user_id WHERE notes.university_id = ? ORDER BY notes.created_at DESC ;`;
    db.query(query, [universityId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        const notes = result.map((note) => ({
            id: note.note_id,
            course: note.course_code,
            courseName: note.course_name,
            shortDescription: note.short_description,
            contentURL: note.content_url,
            creatorId: note.creator_id,
            creatorName: note.creatorName,
            createDate: note.created_at
        }));
        return res.json({ notes });
    });
    
}

const createNote = (req, res) => {
   const { course, courseName, shortDescription, creatorId, universityId } = req.body;
    const noteUrl = req.file
   ? `http://localhost:5000/uploads/notes/${req.file.filename}`
   : null;
   
 const query = `
 INSERT INTO notes (university_id, creator_id, course_code, course_name, short_description, content_url)
 VALUES (?, ?, ?, ?, ?, ?);
`;
    db.query(query, [universityId,creatorId,course,courseName,shortDescription,noteUrl], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(201).json({ note: {
            id: result.insertId,
            course,
            courseName,
            shortDescription,
            contentURL: noteUrl,
            creatorId,
            creatorName: req.cookies.username,
            createDate: new Date().toISOString(),
            universityId
        } });
    });
    }
const updateNote = (req, res) => {
    
    const {id} = req.params;
    const {course, courseName, shortDescription, creatorId, universityId} = req.body;
    console.log(req.body);
    
    const noteUrl = req.file
    ? `http://localhost:5000/uploads/notes/${req.file.filename}`
    : null;

    const query = `UPDATE notes SET course_code = ?, course_name = ?, short_description = ?, content_url = ? WHERE note_id = ?`;
    db.query(query, [course, courseName, shortDescription, noteUrl, id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.status(200).json({ note: {
            id,
            course,
            courseName,
            shortDescription,
            contentURL: noteUrl,
            creatorId,
            creatorName: req.cookies.username,
            createDate: new Date().toISOString(),
            universityId
        } });
    });

    }

const deleteNote = (req, res) => {
    
    const {noteId} = req.params;
    
    const query = `DELETE FROM notes WHERE note_id = ?`;
    
    db.query(query, [noteId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        console.log(result);
        res.status(200).json({ succsess: "Note deleted successfully" });
    });
    }

module.exports = {  getNotes, createNote, updateNote, deleteNote };


