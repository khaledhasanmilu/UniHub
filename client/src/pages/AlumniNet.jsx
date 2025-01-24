import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa'; // Import search icon from react-icons

function AlumniNet() {
  const userUniversity = 'University of ABC'; // Replace with dynamic user university
  const userDepartment = 'Computer Science'; // Replace with dynamic user department
  // State to hold alumni data
  const [universityAlumni, setUniversityAlumni] = useState([]);
  const [departmentAlumni, setDepartmentAlumni] = useState([]);
  const [filter, setFilter] = useState('university'); // 'university' or 'department'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  // Fetch alumni data from the backend
  useEffect(() => {
    const fetchAlumniData = async () => {
      setLoading(true);
      try {
        const universityResponse = await axios.get('http://localhost:5000/api/alumni/getUniversityAlumni', {
          withCredentials: true,
        });
        const departmentResponse = await axios.get('http://localhost:5000/api/alumni/getAlumni', {
          withCredentials: true,
        });
        console.log(universityResponse.data);
        setUniversityAlumni(universityResponse.data);
        setDepartmentAlumni(departmentResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, [userDepartment]);

  // Filter alumni data based on the search query
  const filteredUniversityAlumni = universityAlumni.filter(alumnus =>
    alumnus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDepartmentAlumni = departmentAlumni.filter(alumnus =>
    alumnus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100 mx-8 my-2">
      <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
          <h2 className="text-2xl text-center font-semibold mb-6">Alumni Network</h2>

          {/* Search Bar and Filter Buttons in the same line */}
          <div className="mb-6 flex justify-between items-center">
            <div className="relative flex-1">
              <input
                type="text"
                className="px-4 py-2 w-full border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search Alumni..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute top-2 right-3 text-gray-500" />
            </div>
            
            <div>
              {/* Filter Buttons */}
              <button
                onClick={() => setFilter('university')}
                className={`px-4 py-2 mx-2 rounded-md ${filter === 'university' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                University Alumni
              </button>
              <button
                onClick={() => setFilter('department')}
                className={`px-4 py-2 mx-2 rounded-md ${filter === 'department' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Department Alumni
              </button>
            </div>
          </div>

          {/* Loading and Error */}
          {loading && <p className="text-center text-gray-500">Loading alumni data...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* University Community */}
          {filter === 'university' && !loading && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">University Community - {userUniversity}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUniversityAlumni.length === 0 ? (
                  <p className="text-center text-gray-500">No alumni found from your university.</p>
                ) : (
                  filteredUniversityAlumni.map(alumnus => (
                    <div key={alumnus.user_id} className="bg-gray-50 shadow-md rounded-md p-4">
                      <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                      <p className="text-gray-500">{alumnus.degree}</p>
                      <p className="text-sm text-gray-700">{alumnus.graduation_year}</p>
                      <div className="mt-4">
                        <a href={`/user/${alumnus.user_id}`} className="text-blue-500 hover:text-blue-700">
                          View Profile
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Department Alumni */}
          {filter === 'department' && !loading && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Department Alumni - {userDepartment}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartmentAlumni.length === 0 ? (
                  <p className="text-center text-gray-500">No alumni found from your department.</p>
                ) : (
                  filteredDepartmentAlumni.map(alumnus => (
                    <div key={alumnus.user_id} className="bg-gray-50 shadow-md rounded-md p-4">
                      <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                      <p className="text-gray-500">{alumnus.degree}</p>
                      <p className="text-sm text-gray-700">{alumnus.graduation_year}</p>
                      <div className="mt-4">
                        <a href={`/user/${alumnus.user_id}`} className="text-blue-500 hover:text-blue-700">
                          View Profile
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlumniNet;
