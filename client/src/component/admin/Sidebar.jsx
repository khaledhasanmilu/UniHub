import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Sidebar = ({ onSelectOption }) => {
  const navigate = useNavigate();

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
          navigate('/login'); // Redirect to /admin after logout
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
    <div className="bg-gray-800 text-white w-5xl p-6 max-h-full flex flex-col justify-between h-screen overflow-y-hidden">
      <div>
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => onSelectOption('dashboard')}
              className="w-full text-left p-2 rounded hover:bg-gray-700"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelectOption('topusers')}
              className="w-full text-left p-2 rounded hover:bg-gray-700"
            >
              Top Users
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelectOption('post')}
              className="w-full text-left p-2 rounded hover:bg-gray-700"
            >
              Top Posts
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelectOption('university')}
              className="w-full text-left p-2 rounded hover:bg-gray-700"
            >
              Add University
            </button>
          </li>
          <li>
            <button
              onClick={() => onSelectOption('analytics')}
              className="w-full text-left p-2 rounded hover:bg-gray-700"
            >
              Monthly Growth
            </button>
          </li>
        </ul>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 w-full flex items-center justify-center text-left p-2 rounded hover:bg-red-600 text-red-400 hover:text-white"
      >
        <FiLogOut className="mr-2" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
