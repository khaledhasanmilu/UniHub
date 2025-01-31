import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser, faSignOutAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  const profileImage = localStorage.getItem('userImageUrl') || 'http://localhost:5000/uploads/images/user.png';

  // Handle logout
  const handleLogout = () => {
    axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true })
      .then((response) => {
        if (response.data.message) {
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          alert("Logout failed: " + response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
        alert("An error occurred while logging out!");
      });
  };

  // Handle search input change
  useEffect(() => {
    if (searchQuery.length > 0) {
      axios.get(`http://localhost:5000/api/user/search`, { params: { query: searchQuery } })
        .then((response) => {
          setSearchResults(response.data.users || []);
          console.log(response.data.users);
          setShowSearchPopup(true);
        })
        .catch((error) => console.error("Search error:", error));
    } else {
      setSearchResults([]);
      setShowSearchPopup(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-10">
      <div className="flex items-center justify-between p-2 mx-6">
        {/* Left - Brand Name */}
        <div className="text-2xl font-semibold">UniHub</div>

        {/* Middle - Search Bar */}
        <div className="flex-1 mx-8 max-w-md relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          />

          {/* Search Popup */}
          {showSearchPopup && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-300 shadow-md rounded-md mt-1 max-h-60 overflow-auto">
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <Link
                    to={`/user/${user.userId}`}
                    key={user.id}
                    className=" p-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <img src={user.profilePicture || profileImage} alt={user.name} className="h-8 w-8 rounded-full" />
                    <span>{user.name}</span>
                  </Link>
                ))
              ) : (
                <div className="p-2 text-gray-500">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* Right - Links & Profile Dropdown */}
        <div className="flex items-center space-x-4 ml-2.5">
          <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faHome} className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-gray-900 flex items-center space-x-2">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
            <span>Profile</span>
          </Link>

          {/* Profile Image & Logout Dropdown */}
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="h-9 w-9 rounded-full cursor-pointer border-2 border-gray-300 transition-transform duration-200 ease-in-out hover:scale-110"
              onClick={() => setShowLogoutPopup(!showLogoutPopup)}
            />

            {/* Logout Popup */}
            {showLogoutPopup && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 shadow-lg rounded-md">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 w-full text-left text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
