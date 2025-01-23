import React, { useState } from 'react';
import NoteCard from '../component/NoteCard';
import { FaPlusCircle } from 'react-icons/fa'; 
const dummyNotes = [
    { id: 1, course: "CSE2201", title: "Algebra Basics", content: "Introduction to algebra." },
    { id: 2, course: "Mathematics", title: "Calculus I", content: "Limits and derivatives." },
    { id: 3, course: "Physics", title: "Newton's Laws", content: "Fundamentals of motion." },
    { id: 4, course: "Chemistry", title: "Periodic Table", content: "Elements and properties." }
];

const QuestionPage = () => {
    const [search, setSearch] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({ course: "", title: "", content: "" });

    const uniqueCourses = [...new Set(dummyNotes.map(note => note.course))];

    const filteredNotes = dummyNotes.filter(note => 
        (selectedCourse === "" || note.course === selectedCourse) && 
        (search === "" || note.title.toLowerCase().includes(search.toLowerCase()))
    );

    const groupedNotes = filteredNotes.reduce((groups, note) => {
        if (!groups[note.course]) groups[note.course] = [];
        groups[note.course].push(note);
        return groups;
    }, {});

    const handleCreateNote = () => {
        if (newNote.course && newNote.title && newNote.content) {
            dummyNotes.push({ id: dummyNotes.length + 1, ...newNote });
            setIsModalOpen(false);
            setNewNote({ course: "", title: "", content: "" });
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100 mx-8 my-2">
            <div className="flex-1">
                <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl mx-60 p-8">
                    <h1 className="text-2xl font-semibold text-center text-blue-600">Find Notes</h1>
                    <button 
                        className="mt-6 w-fit px-4 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all flex items-center justify-center"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <FaPlusCircle className="mr-2 text-white" /> Create Note
                    </button>
                    <div className="mt-2 flex gap-10 w-full justify-center ">
                        <div className="flex items-center border rounded-full p-2 w-md">
                            <i className="fas fa-search text-gray-400 mr-2"></i>
                            <input 
                                type="text" 
                                placeholder="Search by title" 
                                className="border-none outline-none w-full p-1"
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>
                        <select 
                            className="border  rounded-full outline-none" 
                            value={selectedCourse} 
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {uniqueCourses.map(course => <option key={course} value={course}>{course}</option>)}
                        </select>
                    </div>
                    
                   
                    
                    <div className="mt-8">
                        {Object.keys(groupedNotes).map(course => (
                            <div key={course} className="mb-6">
                                <h2 className="text-xl font-semibold text-center text-blue-500 border-b pb-2">{course}</h2>
                                {groupedNotes[course].map(note => (
                                    <NoteCard key={note.id} title={note.title} content={note.content} />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                            <h2 className="text-xl font-semibold mb-4 text-blue-500">Create New Note</h2>
                            <input 
                                type="text" 
                                placeholder="Course Name" 
                                className="w-full border p-2 rounded-full mb-4"
                                value={newNote.course} 
                                onChange={(e) => setNewNote({ ...newNote, course: e.target.value })} 
                            />
                            <input 
                                type="text" 
                                placeholder="Title" 
                                className="w-full border p-2 rounded-full mb-4"
                                value={newNote.title} 
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} 
                            />
                            <textarea 
                                placeholder="Content" 
                                className="w-full border p-2 rounded-md mb-4"
                                value={newNote.content} 
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} 
                            ></textarea>
                            <div className="flex justify-end gap-2">
                                <button className="px-4 py-2 bg-gray-400 text-white rounded-full" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button className="px-4 py-2 bg-blue-500 text-white rounded-full" onClick={handleCreateNote}>Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default QuestionPage;
