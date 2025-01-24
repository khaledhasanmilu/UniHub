
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
    res.json({ notes });
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
    res.send('PUT request to the homepage');
    }

const deleteNote = (req, res) => {
    res.send('DELETE request to the homepage');
    }

module.exports = {  getNotes, createNote, updateNote, deleteNote };


