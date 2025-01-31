import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Cookies from 'js-cookie';
import { faHome, faComment, faCalendar, faUsers, faSignOutAlt, faBriefcase, faQuestionCircle, faSearch, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const role = Cookies.get('role');
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
<div className="fixed top-0 h-full pt-16 left-0 w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
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
          {role === 'Student' && (
            <>
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
                  onClick={() => navigate('/questionBank')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="h-5 w-5" />
                  <span>Share Note's</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/findGroupmate')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faSearch} className="h-5 w-5" />
                  <span>Find Groupmate</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
                  <span>Jobs</span>
                </button>
              </li>
            </>
          )}
          {role === 'Alumni' && (
            <>
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
                  onClick={() => navigate('/jobs')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
                  <span>Jobs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/alumninet')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faNetworkWired} className="h-5 w-5" />
                  <span>AlumniNet</span>
                </button>
              </li>
            </>
          )}
          {role === 'Industry' && (
            <>
              <li>
                <button
                  onClick={() => navigate('/jobs')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
                  <span>Jobs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/applications')}
                  className="w-full text-left flex items-center space-x-3 py-2 px-4 rounded-md hover:bg-gray-700 active:bg-gray-600 transition duration-200"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5" />
                  <span>Applications</span>
                </button>
              </li>
              
            </>
          )}
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
