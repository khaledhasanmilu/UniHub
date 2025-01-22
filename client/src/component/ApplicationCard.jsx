import React, { useState } from 'react';
import axios from 'axios';

const ApplicationCard = ({ application, onStatusChange }) => {
  const [status, setStatus] = useState(application.application_status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
  
    if (newStatus === "Rejected") {
      const confirmReject = window.confirm("Are you sure you want to reject this application?");
      if (!confirmReject) {
        return; // If user cancels, do nothing
      }
    }
  
    setStatus(newStatus);
    setIsUpdating(true);
  
    try {
      const response = await axios.put('http://localhost:5000/api/job/updateApplicationStatus', {
        application_id: application.application_id,
        status: newStatus,
      });
  
      if (response.status === 200) {
        onStatusChange(application.application_id, newStatus);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-all">
      <h3 className="text-2xl font-semibold text-gray-800">{application.applicant_name}</h3>
      <p className="text-sm text-gray-500 mb-2">{application.applicant_email}</p>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-700">Resume:</span>
        <a href={application.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">
          View Resume
        </a>
      </div>

      <button
        onClick={toggleModal}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
      >
        View Cover Letter
      </button>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="status" className="text-gray-600 font-medium">Application Status:</label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            aria-label="Application Status"
            className="bg-gray-100 p-2 rounded-lg border border-gray-300 text-gray-700"
            disabled={isUpdating}
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
          {isUpdating && <div className="ml-2 animate-spin text-blue-500">...</div>}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 transition-all">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">Cover Letter</h3>
            <p className="text-gray-700">{application.cover_letter || 'No cover letter provided.'}</p>
            <button
              onClick={toggleModal}
              className="mt-6 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
