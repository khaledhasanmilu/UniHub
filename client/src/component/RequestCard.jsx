import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function RequestCard({ request, handleDelete, handleEdit }) {
  const loggedInUserId = 1; // Replace with dynamic user authentication logic if needed
  const [isEditing, setIsEditing] = useState(false);
  const [editedRequest, setEditedRequest] = useState({ ...request });
  const navigate = useNavigate(); // Hook for navigation

  const handleInputChange = (e) => {
    setEditedRequest({
      ...editedRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    handleEdit(editedRequest);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-200 p-4 rounded-md shadow-md">
      {isEditing ? (
        <>
          <input type="text" name="projectName" value={editedRequest.projectName} onChange={handleInputChange} className="w-full p-1 border rounded" />
          <input type="text" name="courseName" value={editedRequest.courseName} onChange={handleInputChange} className="w-full p-1 border rounded mt-2" />
          <input type="text" name="semester" value={editedRequest.semester} onChange={handleInputChange} className="w-full p-1 border rounded mt-2" />
          <textarea name="description" value={editedRequest.description} onChange={handleInputChange} className="w-full p-1 border rounded mt-2"></textarea>
          <input type="date" name="endTime" value={editedRequest.endTime} onChange={handleInputChange} className="w-full p-1 border rounded mt-2" />
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{request.projectName}</h3>
          <p className="text-sm text-gray-600">{request.courseName} - {request.semester}</p>
          <p className="text-sm text-gray-800">{request.description}</p>
          <p className="text-sm text-gray-500">
            Posted by: 
            <span 
              className="font-semibold text-blue-500 hover:underline cursor-pointer"
              onClick={() => navigate(`/user/${request.userId}`)}
            >
              {request.userName}
            </span>
          </p>
          <p className="text-sm text-red-500">Deadline: {request.endTime}</p>
        </>
      )}

      {/* Show buttons only if the request belongs to the logged-in user */}
      {request.userId === loggedInUserId && (
        <div className="mt-2 flex space-x-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => handleDelete(request)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default RequestCard;
