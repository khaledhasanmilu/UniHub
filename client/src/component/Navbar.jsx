import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    // Make a logout API request (optional, depends on your backend)
    fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Send token if required
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Logout Response:', data);
        if (data.message) {
          // Clear the stored token
          localStorage.removeItem('authToken');
          // Redirect to login page
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
        <div className="space-x-4">
          <button className="text-gray-600 hover:text-gray-900">Home</button>
          <button className="text-gray-600 hover:text-gray-900">Profile</button>
          <button className="text-gray-600 hover:text-gray-900">Notifications</button>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
