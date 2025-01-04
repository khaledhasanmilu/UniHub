import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import the icons

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
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
    <div className="w-full bg-white shadow-md sticky top-0 z-10">
      <div className="flex justify-between items-center p-4">
        <div className="text-2xl font-semibold">UniHub</div>
        <div className="space-x-4 flex items-center">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span>Notifications</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
