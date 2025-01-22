import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AlumniNet() {
  // State to hold alumni data
  const [alumni, setAlumni] = useState([]);

  // Fetch alumni data
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni'); // Endpoint to get alumni data
        setAlumni(response.data);
      } catch (error) {
        console.error('Error fetching alumni data:', error);
      }
    };

    fetchAlumni();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
          <h2 className="text-2xl text-center font-semibold mb-6">Alumni Network</h2>

          {/* Display alumni list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.length === 0 ? (
              <p className="text-center text-gray-500">No alumni found.</p>
            ) : (
              alumni.map((alumnus) => (
                <div key={alumnus.id} className="bg-gray-50 shadow-md rounded-md p-4">
                  <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                  <p className="text-gray-500">{alumnus.degree}</p>
                  <p className="text-sm text-gray-700">{alumnus.yearOfGraduation}</p>
                  <div className="mt-4">
                    <a
                      href={`/alumni/${alumnus.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* If no alumni data */}
          {alumni.length === 0 && (
            <div className="mt-8">
              <p className="text-center text-lg font-semibold text-gray-700">Join the alumni network today!</p>
              <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Become an Alumni
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlumniNet;
