import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { FaCalendarPlus } from 'react-icons/fa';
import Cookies from 'js-cookie'; // Import Cookies

const CreateEvent = ({ onCreate }) => {
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        venue: '',
        startDate: '',
        endDate: '',
        type: 'intra-university', // Default type
    });
    const creator_id = Cookies.get('uid');          
    const [imageFile, setImageFile] = useState(null); // Separate state for the image file
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateEvent = async () => {
        if (
            newEvent.title &&
            newEvent.description &&
            newEvent.venue &&
            imageFile &&
            newEvent.startDate &&
            newEvent.endDate &&
            newEvent.type
        ) {
            setIsSubmitting(true);

            try {
                // Create FormData instance and append fields
                const formData = new FormData();
                formData.append('title', newEvent.title);
                formData.append('description', newEvent.description);
                formData.append('venue', newEvent.venue);
                formData.append('startDate', newEvent.startDate);
                formData.append('endDate', newEvent.endDate);
                formData.append('type', newEvent.type);
                formData.append('image', imageFile); // Append the image file
                formData.append('creator_id', creator_id); // Append the creator_id

                // Replace 'YOUR_API_ENDPOINT' with your backend API endpoint
                const response = await axios.post('http://localhost:5000/api/event/createEvent', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 201) {
                    onCreate({ ...newEvent, id: response.data.id || Date.now() });
                    setNewEvent({
                        title: '',
                        description: '',
                        venue: '',
                        startDate: '',
                        endDate: '',
                        type: 'intra-university',
                    });
                    setImageFile(null); // Reset image file
                    setIsPopupOpen(false);
                }
            } catch (error) {
                console.error('Failed to create event:', error);
                alert('Failed to create the event. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            alert('Please fill in all fields!');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Set the image file
        }
    };

    return (
        <div className="mt-8">
            <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center"
            >
                <FaCalendarPlus className="mr-2" />
                Create Event
            </button>

            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4">Create New Event</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newEvent.title}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, title: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <textarea
                                placeholder="Description"
                                value={newEvent.description}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, description: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Venue"
                                value={newEvent.venue}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, venue: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 border rounded-md"
                            />
                            <div className="flex gap-4">
                                <input
                                    type="date"
                                    value={newEvent.startDate}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, startDate: e.target.value })
                                    }
                                    className="p-2 border rounded-md flex-1"
                                />
                                <input
                                    type="date"
                                    value={newEvent.endDate}
                                    onChange={(e) =>
                                        setNewEvent({ ...newEvent, endDate: e.target.value })
                                    }
                                    className="p-2 border rounded-md flex-1"
                                />
                            </div>
                            <select
                                value={newEvent.type}
                                onChange={(e) =>
                                    setNewEvent({ ...newEvent, type: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            >
                                <option value="intra-university">Intra University</option>
                                <option value="inter-university">Inter University</option>
                            </select>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreateEvent}
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Event'}
                                </button>
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateEvent;
