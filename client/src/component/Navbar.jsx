import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBell, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Logout Response:', data);
        if (data.message) {
          localStorage.removeItem('authToken');
          navigate('/login');
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
    <div className="w-full bg-white shadow-md sticky top-0 z-100">
      <div className="flex items-center justify-between p-2 mx-6">
        
        {/* Left - Brand Name */}
        <div className="text-2xl font-semibold">UniHub</div>

        {/* Middle - Search Bar */}
        <div className="flex-1 mx-8 max-w-md relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />
        </div>

        {/* Right - Links & Logout Button */}
        <div className="flex items-center space-x-4 ml-2.5">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
            <span>Profile</span>
          </Link>
          {/* <button className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
            <span>Notifications</span>
          </button> */}
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
