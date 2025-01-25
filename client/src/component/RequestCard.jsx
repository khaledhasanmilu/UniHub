import React from 'react';

function RequestCard({ request }) {
    return (
        <div className="bg-white shadow-md rounded-md p-6 mb-4">
            <h3 className="text-xl font-semibold mb-2">{request.projectName}</h3>
            <p className="text-sm text-gray-500 mb-2">User: {request.userName}</p>
            <p className="text-sm text-gray-500 mb-2">Course: {request.courseName}</p>
            <p className="text-sm text-gray-500 mb-2">Semester: {request.semester}</p>
            <p className="text-sm text-gray-600 mb-2">Description: {request.description}</p>
            <p className="text-sm text-gray-500">End Time: {request.endTime}</p>
        </div>
    );
}

export default RequestCard;
