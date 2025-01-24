import React, { useState, useEffect } from 'react';

function AlumniNet() {
  // Assume user details (Replace with actual user authentication data later)
  const userUniversity = 'XYZ University';
  const userDepartment = 'Computer Science';

  // Dummy alumni data
  const dummyAlumni = [
    { id: 1, name: 'Alice Johnson', degree: 'BSc in Computer Science', yearOfGraduation: 2018, university: 'XYZ University', department: 'Computer Science' },
    { id: 2, name: 'Bob Smith', degree: 'BSc in Electrical Engineering', yearOfGraduation: 2017, university: 'XYZ University', department: 'Electrical Engineering' },
    { id: 3, name: 'Charlie Brown', degree: 'BSc in Computer Science', yearOfGraduation: 2019, university: 'XYZ University', department: 'Computer Science' },
    { id: 4, name: 'David Lee', degree: 'BSc in Civil Engineering', yearOfGraduation: 2020, university: 'ABC University', department: 'Civil Engineering' },
    { id: 5, name: 'Emma Watson', degree: 'BSc in Computer Science', yearOfGraduation: 2016, university: 'XYZ University', department: 'Computer Science' },
    { id: 6, name: 'Frank Miller', degree: 'BSc in Mechanical Engineering', yearOfGraduation: 2015, university: 'XYZ University', department: 'Mechanical Engineering' },
  ];

  // State to hold alumni data
  const [universityAlumni, setUniversityAlumni] = useState([]);
  const [departmentAlumni, setDepartmentAlumni] = useState([]);

  // Filter alumni data when component mounts
  useEffect(() => {
    // Filter university and department alumni
    const filteredUniversityAlumni = dummyAlumni.filter(alumnus => alumnus.university === userUniversity);
    const filteredDepartmentAlumni = dummyAlumni.filter(alumnus => alumnus.university === userUniversity && alumnus.department === userDepartment);

    // Set state
    setUniversityAlumni(filteredUniversityAlumni);
    setDepartmentAlumni(filteredDepartmentAlumni);
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100 mx-8 my-2">
      <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
          <h2 className="text-2xl text-center font-semibold mb-6">Alumni Network</h2>

          {/* University Community */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">University Community - {userUniversity}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universityAlumni.length === 0 ? (
                <p className="text-center text-gray-500">No alumni found from your university.</p>
              ) : (
                universityAlumni.map(alumnus => (
                  <div key={alumnus.id} className="bg-gray-50 shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                    <p className="text-gray-500">{alumnus.degree}</p>
                    <p className="text-sm text-gray-700">{alumnus.yearOfGraduation}</p>
                    <div className="mt-4">
                      <a href={`/alumni/${alumnus.id}`} className="text-blue-500 hover:text-blue-700">
                        View Profile
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Alumni */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-green-700">Department Alumni - {userDepartment}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentAlumni.length === 0 ? (
                <p className="text-center text-gray-500">No alumni found from your department.</p>
              ) : (
                departmentAlumni.map(alumnus => (
                  <div key={alumnus.id} className="bg-gray-50 shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                    <p className="text-gray-500">{alumnus.degree}</p>
                    <p className="text-sm text-gray-700">{alumnus.yearOfGraduation}</p>
                    <div className="mt-4">
                      <a href={`/alumni/${alumnus.id}`} className="text-blue-500 hover:text-blue-700">
                        View Profile
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Join Alumni Community */}
          {dummyAlumni.length === 0 && (
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
