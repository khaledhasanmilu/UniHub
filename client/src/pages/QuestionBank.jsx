import React, { useState, useEffect } from 'react';
import NoteCard from '../component/NoteCard';
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

const QuestionPage = () => {
    const [search, setSearch] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // New state for edit modal
    const [showMyNotes, setShowMyNotes] = useState(false);
    const [notes, setNotes] = useState([]);
    const [uploading, setUploading] = useState(false);

    const creatorId = Cookies.get("uid") || null;
    const universityId = localStorage.getItem("university") || null;

    const [newNote, setNewNote] = useState({
        course: "", 
        courseName: "", 
        shortDescription: "", 
        file: null,
        creatorId: "",
        creator: "",
        contentUrl: "",
    });

    const [editingNote, setEditingNote] = useState(null);  // State for storing the note being edited

    useEffect(() => {
        axios.get(`http://localhost:5000/api/note/getNotes/${universityId}`)
            .then(response => {
                setNotes(response.data.notes);
                console.log(response.data.notes);
            })
            .catch(error => {
                console.error("Error fetching notes:", error);
            });
    }, [universityId]);

    const uniqueCourses = [...new Set(notes.map(note => note.course))];
    const filteredNotes = notes.filter(note => 
        (selectedCourse === "" || note.course === selectedCourse) && 
        (search === "" || note.courseName.toLowerCase().includes(search.toLowerCase()))
    );
    
    const myNotes = notes.filter(note => String(note.creatorId) === creatorId);
    const groupedNotes = filteredNotes.reduce((groups, note) => {
        if (!groups[note.course]) groups[note.course] = [];
        groups[note.course].push(note);
        return groups;
    }, {});

    const handleFileChange = (e) => {
        setNewNote({ ...newNote, file: e.target.files[0] });
    };

    const handleCreateNote = async () => {
        if (newNote.course && newNote.courseName && newNote.shortDescription && newNote.file) {
            setUploading(true);
            const formData = new FormData();
            formData.append("course", newNote.course);
            formData.append("courseName", newNote.courseName);
            formData.append("shortDescription", newNote.shortDescription);
            formData.append("file", newNote.file);
            formData.append("creatorId", creatorId);
            formData.append("universityId", universityId);

            try {
                const response = await axios.post("http://localhost:5000/api/note/createNote", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                setNotes(prevNotes => [...prevNotes, response.data.note]);
                setIsModalOpen(false);
                setNewNote({ course: "", courseName: "", shortDescription: "", file: null });
            } catch (error) {
                console.error("Error uploading note:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleEditNote = (note) => {
        setEditingNote(note);  // Set the note being edited
        setIsEditModalOpen(true);  // Open the edit modal
    };

    const handleSaveEdit = async () => {
        if (editingNote) {
            setUploading(true);
            console.log(editingNote);
            const formData = new FormData();
            formData.append("course", editingNote.course);
            formData.append("courseName", editingNote.courseName);
            formData.append("shortDescription", editingNote.shortDescription);
            formData.append("file", editingNote.file);
            formData.append("creatorId", creatorId);
            formData.append("universityId", universityId);

            try {
                const response = await axios.put(`http://localhost:5000/api/note/editNote/${editingNote.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                setNotes(prevNotes => prevNotes.map(note => note.id === editingNote.id ? response.data.note : note));
                setIsEditModalOpen(false);  // Close the edit modal
               
            } catch (error) {
                console.error("Error editing note:", error);
            } finally {
                setUploading(false);
                setEditingNote(null);  // Reset the editing note state
            }
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/note/deleteNote/${noteId}`, {
                withCredentials: true,
            });
            console.log(response);
            if (response.data.succsess) {
                setNotes(prevNotes => prevNotes.filter(note => String(note.id) !== String(noteId)));
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const renderNoteRows = (notes) => {
        const rows = [];
        for (let i = 0; i < notes.length; i += 3) {
            rows.push(notes.slice(i, i + 3));
        }
        return rows;
    };

    return (
        <div className="min-h-screen bg-gray-50 sm:p-10">
            <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-6xl mx-60">
                <h1 className="text-3xl font-semibold text-blue-600 mb-8 text-center">Find Notes</h1>

                {/* Filter & Actions */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6">
                    <div className="flex gap-3 w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Search by course title" 
                            className="w-full sm:w-64 border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <select 
                            className="border border-gray-300 rounded-lg p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4 sm:mt-0">
                        <button 
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <FaPlusCircle className="mr-2" /> Create Note
                        </button>
                        <button 
                            className={`px-6 py-3 rounded-lg transition-all flex items-center ${showMyNotes ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-300 text-black hover:bg-gray-400"}`}
                            onClick={() => setShowMyNotes(!showMyNotes)}
                        >
                            My Notes
                        </button>
                    </div>
                </div>

                {/* Notes Display */}
                <div className="space-y-6">
                    {showMyNotes ? (
                        <div>
                            <h2 className="text-2xl font-semibold text-center text-blue-600 mb-4">My Notes</h2>
                            {myNotes.length > 0 ? (
                                myNotes.map(note => (
                                    <NoteCard 
                                        key={note.id} 
                                        courseCode={note.course}
                                        courseName={note.courseName} 
                                        title={note.courseName}
                                        contentUrl={note.contentURL}
                                        shortDescription={note.shortDescription} 
                                        creator={note.creatorName}
                                        createId={note.creatorId}
                                        createDate={note.createDate}
                                        noteId={note.id} 
                                        handleEditNote={() => handleEditNote(note)}
                                        handleDeleteNote={handleDeleteNote}
                                    />
                                ))
                            ) : (
                                <p className="text-center text-gray-500 mt-4">You haven't uploaded any notes yet.</p>
                            )}
                        </div>
                    ) : (
                        Object.keys(groupedNotes).map(course => (
                            <div key={course}>
                                <h2 className="text-xl font-semibold text-blue-600 border-b pb-2">{course}</h2>
                                {renderNoteRows(groupedNotes[course]).map((row, rowIndex) => (
                                    <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {row.map(note => (
                                            <NoteCard 
                                                key={note.id} 
                                                courseCode={note.course}
                                                courseName={note.courseName} 
                                                title={note.courseName}
                                                contentUrl={note.contentURL}
                                                shortDescription={note.shortDescription} 
                                                creator={note.creatorName}
                                                createId={note.creatorId}
                                                createDate={note.createDate}
                                                noteId={note.id}
                                                handleEditNote={() => handleEditNote(note)} 
                                                handleDeleteNote={handleDeleteNote}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Note Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                        <button 
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">Create New Note</h2>
                        <input 
                            type="text" 
                            placeholder="Course Code" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={newNote.course} 
                            onChange={(e) => setNewNote({ ...newNote, course: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Course Name" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={newNote.courseName} 
                            onChange={(e) => setNewNote({ ...newNote, courseName: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Short Description" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={newNote.shortDescription} 
                            onChange={(e) => setNewNote({ ...newNote, shortDescription: e.target.value })} 
                        />
                        <input 
                            type="file" 
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleFileChange} 
                        />
                        <button 
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
                            onClick={handleCreateNote} 
                            disabled={uploading}
                        >
                            {uploading ? "Uploading..." : "Create"}
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Note Modal */}
            {isEditModalOpen && editingNote && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
                        <button 
                            className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                            onClick={() => setIsEditModalOpen(false)}
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">Edit Note</h2>
                        <input 
                            type="text" 
                            placeholder="Course Code" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={editingNote.course} 
                            onChange={(e) => setEditingNote({ ...editingNote, course: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Course Name" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={editingNote.courseName} 
                            onChange={(e) => setEditingNote({ ...editingNote, courseName: e.target.value })} 
                        />
                        <input 
                            type="text" 
                            placeholder="Short Description" 
                            className="w-full border p-3 rounded-lg mb-4"
                            value={editingNote.shortDescription} 
                            onChange={(e) => setEditingNote({ ...editingNote, shortDescription: e.target.value })} 
                        />
                        <input 
                            type="file" 
                            className="w-full border p-3 rounded-lg mb-4"
                            onChange={handleFileChange} 
                        />
                        <button 
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg w-full"
                            onClick={handleSaveEdit} 
                            disabled={uploading}
                        >
                            {uploading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionPage;
