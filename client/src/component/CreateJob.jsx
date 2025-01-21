import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { FaBriefcase } from 'react-icons/fa';
import Cookies from 'js-cookie'; // Import Cookies

const CreateJob = ({ onCreate }) => {
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        description: '',
        jobType: 'Full-Time', // Default job type
        expectedSalary: '',
        applicationDeadline: '',
        requiredSkills: '',
    });
    const creator_id = Cookies.get('uid');          
    const [imageFile, setImageFile] = useState(null); // Company logo upload
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateJob = async () => {
        if (
            newJob.title &&
            newJob.company &&
            newJob.description &&
            newJob.jobType &&
            newJob.expectedSalary &&
            newJob.applicationDeadline &&
            newJob.requiredSkills
        ) {
            setIsSubmitting(true);
    
            try {
                // Create FormData instance and append fields
                const formData = new FormData();
                formData.append('title', newJob.title);
                formData.append('company', newJob.company);
                formData.append('description', newJob.description);
                formData.append('jobType', newJob.jobType);
                formData.append('expectedSalary', newJob.expectedSalary);
                formData.append('applicationDeadline', newJob.applicationDeadline);
                formData.append('requiredSkills', newJob.requiredSkills);
                if (imageFile) formData.append('image', imageFile); // Append the company logo
                formData.append('creator_id', creator_id); // Append the creator ID
    
                // Make the API request
                const response = await axios.post('http://localhost:5000/api/job/createJob', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                // Ensure the response is valid before proceeding
                if (response && response.status === 201) {
                    // Success: Job created
                    alert('Job created successfully!');
                    onCreate({ ...newJob, id: response.data.id || Date.now() });
                    setNewJob({
                        title: '',
                        company: '',
                        description: '',
                        jobType: 'Full-Time',
                        expectedSalary: '',
                        applicationDeadline: '',
                        requiredSkills: '',
                    });
                    setImageFile(null); // Reset logo file
                    setIsPopupOpen(false);
                } else {
                    // API response was not successful
                    throw new Error('Failed to create the job');
                }
            } catch (error) {
                console.error('Error creating job:', error);
                alert('Failed to create the job. Please try again.');
            } finally {
                setIsSubmitting(false);
                setIsPopupOpen(false);
            }
        } else {
            alert('Please fill in all fields!');
        }
    };
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // Set the company logo
        }
    };

    return (
        <div className="mt-8">
            <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center"
            >
                <FaBriefcase className="mr-2" />
                Create New Job
            </button>

            {isPopupOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[600px] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Create New Job</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={newJob.title}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, title: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Company Name"
                                value={newJob.company}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, company: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <textarea
                                placeholder="Job Description"
                                value={newJob.description}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, description: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 border rounded-md"
                            />
                            <select
                                value={newJob.jobType}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, jobType: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            >
                                <option value="Full-Time">Full-Time</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Expected Salary (e.g. $50k - $70k)"
                                value={newJob.expectedSalary}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, expectedSalary: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="date"
                                value={newJob.applicationDeadline}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, applicationDeadline: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Required Skills (comma-separated)"
                                value={newJob.requiredSkills}
                                onChange={(e) =>
                                    setNewJob({ ...newJob, requiredSkills: e.target.value })
                                }
                                className="p-2 border rounded-md"
                            />
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreateJob}
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Job'}
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

export default CreateJob;
