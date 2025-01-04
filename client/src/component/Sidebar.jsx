import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComment, faCalendar, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Adding the logout icon

const Sidebar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // This function will handle logout logic
  const handleLogout = () => {
    // Make a logout API request
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This ensures that cookies are sent with the request
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Logout Response:', data);
        if (data.message) {
          // Clear the stored token in localStorage (if it's still there)
          localStorage.removeItem('authToken');
          // Redirect to login page or home page
          navigate('/');
        } else {
          alert('Logout failed: ' + data.message);
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        alert('An error occurred while logging out!');
      });
  };

  return (
    <div className="fixed top-0 h-full pt-16 left-0 w-64  bg-gray-800 text-white p-4 flex flex-col justify-between">
      <div>
        <ul className="space-y-4 mt-6">
          <li>
            <button
              onClick={() => navigate('/feed')}
              className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
            >
              <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
              <span>Feed</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/messages')}
              className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
            >
              <FontAwesomeIcon icon={faComment} className="h-5 w-5" />
              <span>Messages</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/events')}
              className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
            >
              <FontAwesomeIcon icon={faCalendar} className="h-5 w-5" />
              <span>Events</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/groups')}
              className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
            >
              <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />
              <span>Groups</span>
            </button>
          </li>
        </ul>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-500 transition duration-200"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
