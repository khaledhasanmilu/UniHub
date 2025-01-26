import React from 'react';
import { useNavigate } from 'react-router-dom';

function RequestCard({ request }) {
    const navigate = useNavigate();

    const handleRequestClick = () => {
        navigate(`/user/${request.user_id}`);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 hover:shadow-xl border-gray-200 transition-all duration-300 ease-in-out ">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{request.project_name}</h3>
            
            {/* User Name with Hover Effect */}
            <p
                className="text-sm text-blue-600 font-medium mb-3 cursor-pointer hover:underline"
                onClick={handleRequestClick}
            >
                <span className="font-semibold">User:</span> {request.username}
            </p>

            {/* Course, Semester, Description, and End Time with Improved Spacing */}
            <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Course:</span> {request.course_name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Semester:</span> {request.semester}
            </p>
            <p className="text-sm text-gray-700 mb-4">
                <span className="font-semibold">Description:</span> {request.description}
            </p>

            <p className="text-sm text-gray-600">
                <span className="font-semibold">End Time:</span> {request.end_time}
            </p>
        </div>
    );
}

export default RequestCard;
