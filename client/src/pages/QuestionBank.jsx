import React, { useState, useEffect } from 'react';
import NoteCard from '../component/NoteCard';
import { FaPlusCircle, FaTimes } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

const QuestionPage = () => {
    const [search, setSearch] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMyNotes, setShowMyNotes] = useState(false);
    const [notes, setNotes] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Retrieve creator ID and university ID from cookies
    const creatorId = Cookies.get("uid") || null;
    const universityId = localStorage.getItem("university") || null;

    const [newNote, setNewNote] = useState({ 
        course: "", 
        courseName: "", 
        shortDescription: "", 
        file: null,
        creatorId: "",
        creatorName: "",
        contentUrl: "",
    });

    useEffect(() => {
        
            axios.get(`http://localhost:5000/api/note/getNotes`,{
                withCredentials: true,
            })
                .then(response => {
                    console.log("Notes fetched:", response.data.notes);
                    setNotes(response.data.notes);
                })
                .catch(error => {
                    console.error("Error fetching notes:", error);
                });
        
    },[universityId]);

    const uniqueCourses = [...new Set(notes.map(note => note.course))];

    const filteredNotes = notes.filter(note => 
        (selectedCourse === "" || note.course === selectedCourse) && 
        (search === "" || note.courseName.toLowerCase().includes(search.toLowerCase()))
    );

    const myNotes = notes.filter(note => note.creatorId === creatorId);

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
                console.log("Note uploaded:", response.data.note);
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

    return (
        <div className="min-h-screen flex bg-gray-100 mx-8 my-2">
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
                    <h1 className="text-3xl font-bold text-center text-blue-600">Find Notes</h1>

                    {/* Filter & Actions */}
                    <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                        {/* Search Input */}
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md bg-white shadow-sm">
                            <input 
                                type="text" 
                                placeholder="Search by title" 
                                className="border-none outline-none w-full p-1"
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>

                        {/* Course Dropdown */}
                        <select 
                            className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm" 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
                        </select>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button 
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <FaPlusCircle className="mr-2" /> Create Note
                            </button>

                            <button 
                                className={`px-4 py-2 rounded-lg transition-all flex items-center 
                                    ${showMyNotes ? "bg-red-500 text-white hover:bg-red-600" : "bg-gray-300 text-black hover:bg-gray-400"}
                                `}
                                onClick={() => setShowMyNotes(!showMyNotes)}
                            >
                                My Notes
                            </button>
                        </div>
                    </div>

                    {/* Notes Display */}
                    <div className="mt-8">
                        {showMyNotes ? (
                            <div>
                                <h2 className="text-2xl font-semibold text-center text-blue-500 border-b pb-2">My Notes</h2>
                                {myNotes.length > 0 ? (
                                    myNotes.map(note => (
                                        <NoteCard 
                                            key={note.id} 
                                            courseCode={note.course}
                                            title={note.courseName} 
                                            contentUrl={note.contentUrl}
                                            shortDescription={note.shortDescription} 
                                            creator={note.creatorName}
                                            createDate={note.createDate}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 mt-4">You haven't uploaded any notes yet.</p>
                                )}
                            </div>
                        ) : (
                            Object.keys(groupedNotes).map(course => (
                                <div key={course} className="mb-6">
                                    <h2 className="text-xl font-semibold text-center text-blue-400 border-b pb-2">{course}</h2>
                                    {groupedNotes[course].map(note => (
                                        <NoteCard 
                                            key={note.id} 
                                            courseCode={note.course}
                                            title={note.courseName} 
                                            contentUrl={note.contentUrl}
                                            shortDescription={note.shortDescription} 
                                            creator={note.creatorName}
                                            createDate={note.createDate}
                                        />
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Create Note Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96 relative">
                            <button className="absolute top-3 right-3 text-gray-600 hover:text-red-500" onClick={() => setIsModalOpen(false)}>
                                <FaTimes size={20} />
                            </button>
                            <h2 className="text-xl font-semibold mb-4 text-blue-500">Create New Note</h2>
                            <input type="text" placeholder="Course Code" className="w-full border p-2 rounded-lg mb-4"
                                value={newNote.course} onChange={(e) => setNewNote({ ...newNote, course: e.target.value })} />
                            <input type="text" placeholder="Course Name" className="w-full border p-2 rounded-lg mb-4"
                                value={newNote.courseName} onChange={(e) => setNewNote({ ...newNote, courseName: e.target.value })} />
                            <input type="text" placeholder="Short Description" className="w-full border p-2 rounded-lg mb-4"
                                value={newNote.shortDescription} onChange={(e) => setNewNote({ ...newNote, shortDescription: e.target.value })} />
                            <input type="file" className="w-full border p-2 rounded-lg mb-4" onChange={handleFileChange} />
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full" onClick={handleCreateNote} disabled={uploading}>
                                {uploading ? "Uploading..." : "Create"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuestionPage;
