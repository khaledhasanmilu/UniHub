import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../component/JobCard';
import CreateJob from '../component/CreateJob';
import Cookies from 'js-cookie';

function Jobs() {
    const [jobData, setJobData] = useState([]);
    const [salaryFilter, setSalaryFilter] = useState(200000);
    const [jobTypeFilter, setJobTypeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const role = Cookies.get('role');
    const user_id = Cookies.get('uid');
    // Fetch job data from the backend
    useEffect(() => {
        
        const fetchJobs = async () => {
            const url=role==='Industry'?'http://localhost:5000/api/job/getMyJobs':`http://localhost:5000/api/job/getAllJobs`;
            const data = { user_id: user_id };
            try {
                const response = await axios.post(url,data); // Replace with your backend API endpoint
                console.log('Fetched jobs:', response.data); // Check if the data is returned correctly
                setJobData(response.data);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchJobs();
    }, []);

    // Get unique job types
    const jobTypes = ['All', ...new Set(jobData.map(job => job.job_type))];

    // Filter jobs based on selected salary range, job type, and search query
    const filteredJobs = jobData.filter(job =>
        Number(job.expected_salary) <= salaryFilter && // Ensure expected_salary is compared as a number
        (jobTypeFilter === 'All' || job.job_type === jobTypeFilter) && 
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = () => {
        // Trigger search based on the searchQuery state
        // No need for any special functionality as filtering is already handled
    };

    const handleUpdateJob = (updatedJob) => {
        // Update job logic
        console.log(updatedJob);
    };
    
    const handleDeleteJob = (jobId) => {
        // Delete job logic
        console.log('Deleting job with id:', jobId);
    };
    

    return (
        <div className="min-h-screen flex bg-gray-100">
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
                    <h2 className="text-2xl text-center font-semibold mb-6">Jobs</h2>

                    {/* Filters */}
                    <div className="mb-6 flex justify-between items-center content-center gap-4">
                        {/* Create Job Form */}
                        {role === 'Industry' && <CreateJob />}
                        
                        {/* Salary Filter */}
                        <div>
                            <label className="block font-semibold text-gray-700">Filter by Salary: ${salaryFilter.toLocaleString()}</label>
                            <input
                                type="range"
                                min="50000"
                                max="200000"
                                step="5000"
                                value={salaryFilter}
                                onChange={(e) => setSalaryFilter(Number(e.target.value))}
                                className="w-full mt-2"
                            />
                        </div>

                        {/* Job Type Filter */}
                        <div>
                            <label className="block font-semibold text-gray-700">Filter by Job Type:</label>
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => setJobTypeFilter(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                            >
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search by Job Title */}
                        <div>
                            <label className="block font-semibold text-gray-700">Search by Job Title:</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Search for a job"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => 
                            <JobCard 
                            key={index} job={job} 
                            onUpdateJob={handleUpdateJob}
                            onDeleteJob={handleDeleteJob}
                            />)
                        ) : (
                            <p className="text-center text-gray-500">No jobs available with the selected filters.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
