import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../component/JobCard";
import CreateJob from "../component/CreateJob";
import Cookies from "js-cookie";
import moment from 'moment';

function Jobs() {
    const [jobData, setJobData] = useState([]);
    const [salaryFilter, setSalaryFilter] = useState(200000);
    const [jobTypeFilter, setJobTypeFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const role = Cookies.get("role");
    const user_id = Cookies.get("uid");

    const fetchJobs = async () => {
        const url =
            role === "Industry"
                ? "http://localhost:5000/api/job/getMyJobs"
                : "http://localhost:5000/api/job/getAllJobs";
        const data = { user_id: user_id };

        try {
            const response = await axios.post(url, data);
            setJobData(response.data);
        } catch (error) {
            console.error("Error fetching job data:", error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleCreateJob = async (newJob) => {
        // const tempId = `temp-${Date.now()}`;
        // const newJobData = { ...newJob, _id: tempId };
        // setJobData((prevJobs) => [newJobData, ...prevJobs]);

        // try {
        //     await axios.post('http://localhost:5000/api/job/createJob', newJob);
            fetchJobs(); // Refresh UI after successful API call
        // } catch (error) {
        //     console.error("Error creating job:", error);
        //     setJobData((prevJobs) => prevJobs.filter(job => job._id !== tempId));
        //}
    };

    const handleUpdateJob = async (updatedJob) => {
        const oldJobs = [...jobData];
      
        // Format the application_deadline using moment.js to 'YYYY-MM-DD'
        const formattedDate = moment(updatedJob.application_deadline).format('YYYY-MM-DD');
        updatedJob.application_deadline = formattedDate;
      
        const formData = new FormData();
        formData.append("title", updatedJob.title);
        formData.append("expected_salary", updatedJob.expected_salary);
        formData.append("job_type", updatedJob.job_type);
        formData.append("description", updatedJob.description);
        formData.append("company", updatedJob.company);
        formData.append("application_deadline", updatedJob.application_deadline);
        formData.append("required_skills", updatedJob.required_skills);
      
        // Append the image file if it exists
        if (updatedJob.image) {
          formData.append("image", updatedJob.image); // Append the file, not the URL
        }
      
        try {
          await axios.put(`http://localhost:5000/api/job/updateJob/${updatedJob.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          fetchJobs(); // Refresh UI after successful update
        } catch (error) {
          console.error("Error updating job:", error);
          setJobData(oldJobs);
        }
      };
      
    
    const handleDeleteJob = async (jobId) => {
        const oldJobs = [...jobData];
        setJobData((prevJobs) => prevJobs.filter(job => job._id !== jobId));

        try {
            await axios.delete(`http://localhost:5000/api/job/deleteJob/${jobId}`);
            fetchJobs(); // Refresh UI after successful deletion
        } catch (error) {
            console.error("Error deleting job:", error);
            setJobData(oldJobs);
        }
    };

    const jobTypes = ["All", ...new Set(jobData.map((job) => job.job_type))];

    const filteredJobs = jobData.filter(
        (job) =>
            Number(job.expected_salary) <= salaryFilter &&
            (jobTypeFilter === "All" || job.job_type === jobTypeFilter) &&
            job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-gray-100 px-8">
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
                    <h2 className="text-2xl text-center font-semibold mb-6">Jobs</h2>

                    {/* Filters */}
                    <div className="mb-6 flex justify-between items-center content-center gap-4">
                        {/* Create Job Form */}
                        {role === "Industry" && <CreateJob onCreate={handleCreateJob} />}

                        {/* Salary Filter */}
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Filter by Salary: ${salaryFilter.toLocaleString()}
                            </label>
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
                            <label className="block font-semibold text-gray-700">
                                Filter by Job Type:
                            </label>
                            <select
                                value={jobTypeFilter}
                                onChange={(e) => setJobTypeFilter(e.target.value)}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                            >
                                {jobTypes.map((type, index) => (
                                    <option key={index} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Search by Job Title */}
                        <div>
                            <label className="block font-semibold text-gray-700">
                                Search by Job Title:
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Search for a job"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="grid grid-cols-1 gap-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    onUpdateJob={handleUpdateJob}
                                    onDeleteJob={handleDeleteJob}
                                />
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No jobs available with the selected filters.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Jobs;
