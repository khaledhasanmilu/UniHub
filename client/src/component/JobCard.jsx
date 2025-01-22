import React, { useState } from "react";
import {
  FaBriefcase,
  FaBuilding,
  FaMoneyBillWave,
  FaClock,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
} from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';  // Import useNavigate for React Router v6
import moment from "moment";
const JobCard = ({ job, onUpdateJob, onDeleteJob }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newJob, setNewJob] = useState(job); // Pre-populate the job details
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // State to manage delete button status
  const role = Cookies.get("role");

  const navigate = useNavigate();  // Initialize useNavigate

  const handleEditJob = () => {
    setShowPopup(true); // Show the popup when "Edit Job" is clicked
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewJob({ ...newJob, image: file }); // Store the file itself
  };
  

  const handleUpdateJob = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call the update function passed from parent, using the updated job data
    onUpdateJob(newJob);
    setIsSubmitting(false);
    setShowPopup(false); // Close the popup after submission
  };

  const handleDeleteJob = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );
    if (confirmDelete) {
      setIsDeleting(true);
      onDeleteJob(job.id); // Pass the job ID to the parent function for deletion
      setIsDeleting(false);
    }
  };

  const handleApplyNow = () => {
    // Redirect to the job application page with the job ID
    navigate(`/jobapply/${job.id}`);  // Redirect to '/jobapply/{jobId}'
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {/* Header with Company Logo */}
      <div className="flex items-center space-x-4">
        {job.image_url ? (
          <img
            src={job.image_url}
            alt={job.company}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <FaBuilding className="text-gray-600" size={24} />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company}</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="mt-4 space-y-2 text-gray-700">
        <p className="flex items-center">
          <FaBriefcase className="mr-2 text-blue-500" />
          <span className="font-medium">{job.job_type}</span>
        </p>
        <p className="flex items-center">
          <FaMoneyBillWave className="mr-2 text-green-500" />
          <span>{job.expected_salary || "Negotiable"}</span>
        </p>
        <p className="flex items-center">
          <FaClock className="mr-2 text-purple-500" />
          <span>Deadline: {moment(job.application_deadline).fromNow()}</span>
        </p>
        <p className="flex items-center">
          <FaCalendarAlt className="mr-2 text-yellow-500" />
          <span>Required Skills: {job.required_skills}</span>
        </p>
      </div>

      {/* Expandable Job Description */}
      {showDetails && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-800">Job Description:</h4>
          <p className="text-gray-700 mt-2">{job.description}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          onClick={role === "Industry" ? handleEditJob : handleApplyNow}  // Handle Apply Now or Edit Job
        >
          {role === "Industry" ? "Edit Job" : "Apply Now"}
        </button>
        {/* Delete Button for Industry Role */}
        {role === "Industry" && (
          <button
            onClick={handleDeleteJob}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition flex items-center justify-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              "Deleting..."
            ) : (
              <>
                <FaTrash className="mr-2" /> Delete Job
              </>
            )}
          </button>
        )}
        <button
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition flex items-center justify-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ml-2">
            {showDetails ? "Hide Details" : "See Details"}
          </span>
        </button>
      </div>

      {/* Popup for Edit Job */}
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] h-[600px] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Update Job</h3>
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
                value={newJob.job_type}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_type: e.target.value })
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
                value={newJob.expected_salary}
                onChange={(e) =>
                  setNewJob({ ...newJob, expected_salary: e.target.value })
                }
                className="p-2 border rounded-md"
              />
              <input
                type="date"
                value={newJob.application_deadline}
                onChange={(e) =>
                  setNewJob({ ...newJob, application_deadline: e.target.value })
                }
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Required Skills (comma-separated)"
                value={newJob.required_skills}
                onChange={(e) =>
                  setNewJob({ ...newJob, required_skills: e.target.value })
                }
                className="p-2 border rounded-md"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleUpdateJob}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Job"}
                </button>
                <button
                  onClick={() => setShowPopup(false)}
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

export default JobCard;
