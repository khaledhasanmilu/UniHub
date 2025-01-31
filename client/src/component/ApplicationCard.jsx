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
      if (!confirmReject) return;
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
    <div className="bg-white p-6 rounded-2xl mt-2 shadow-md hover:shadow-lg hover:bg-gray-100 transition-all font-roboto border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900">{application.applicant_name}</h3>
      <p className="text-sm text-gray-500 mb-2">{application.applicant_email}</p>

      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm font-medium text-gray-700">Resume:</span>
        <a 
          href={application.resume_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline text-sm"
        >
          View Resume
        </a>
      </div>

      <button 
        onClick={toggleModal} 
        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition"
      >
        View Cover Letter
      </button>

      <div className="mt-4 flex items-center">
        <label htmlFor="status" className="text-gray-700 font-medium">Status:</label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="ml-3 bg-white border border-gray-300 p-2 rounded-lg shadow-sm text-gray-700 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isUpdating}
        >
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
        {isUpdating && (
          <div className="ml-2 animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full animate-fade-in">
            <h3 className="text-2xl font-semibold text-gray-900">Cover Letter</h3>
            <p className="text-gray-700 mt-3">{application.cover_letter || 'No cover letter provided.'}</p>
            <button 
              onClick={toggleModal} 
              className="mt-5 w-full py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition"
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
