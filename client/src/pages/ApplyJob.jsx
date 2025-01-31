import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function ApplyJob() {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [error, setError] = useState(null); // Error state
    const [application, setApplication] = useState({
        name: '',
        email: '',
        resume: null,
        coverLetter: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://localhost:5000/api/job/getJob/${jobId}`)
            .then((response) => setJobDetails(response.data))
            .catch((error) => console.error("Error fetching job details:", error));
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplication((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setApplication((prev) => ({
            ...prev,
            resume: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('name', application.name);
        formData.append('email', application.email);
        formData.append('resume', application.resume);
        formData.append('coverLetter', application.coverLetter);

        try {
            const response = await axios.post(`http://localhost:5000/api/job/applyJob/${jobId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log(response.data);
            alert(response.data.message || 'Application submitted successfully');
            setApplication({
                name: '',
                email: '',
                resume: null,
                coverLetter: '',
            });
            navigate('/jobs');

        } catch (error) {
            setError(error.response?.data?.error || "Error submitting application");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!jobDetails) {
        return <p>Loading job details...</p>;
    }

    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
                    <h1 className="text-2xl font-semibold text-center mb-4">Apply for {jobDetails.title}</h1>
                    <p className="text-gray-500 text-center mb-6">{jobDetails.company}</p>
                    <p className="text-gray-700 mb-4">{jobDetails.description}</p>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Show error */}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={application.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="p-2 border rounded-md"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={application.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className="p-2 border rounded-md"
                                required
                            />
                            <textarea
                                name="coverLetter"
                                value={application.coverLetter}
                                onChange={handleChange}
                                placeholder="Cover Letter"
                                className="p-2 border rounded-md"
                                rows="4"
                                style={{ resize: 'none' }}
                            />
                            <input
                                type="file"
                                name="resume"
                                onChange={handleFileChange}
                                className="p-2 border rounded-md"
                                required
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ApplyJob;
