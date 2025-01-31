import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

function AlumniNet() {
  const userUniversity = "United International University"; // Replace dynamically
  const userDepartment = "Computer Science"; // Replace dynamically

  const [universityAlumni, setUniversityAlumni] = useState([]);
  const [departmentAlumni, setDepartmentAlumni] = useState([]);
  const [filter, setFilter] = useState("university");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Alumni Data
  useEffect(() => {
    const fetchAlumniData = async () => {
      setLoading(true);
      try {
        const [universityResponse, departmentResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/alumni/getUniversityAlumni", { withCredentials: true }),
          axios.get("http://localhost:5000/api/alumni/getAlumni", { withCredentials: true }),
        ]);

        setUniversityAlumni(universityResponse.data);
        setDepartmentAlumni(departmentResponse.data);
      } catch (err) {
        setError("Failed to load alumni data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, []);

  // Filter Alumni with useMemo for performance
  const filteredAlumni = useMemo(() => {
    const list = filter === "university" ? universityAlumni : departmentAlumni;
    return list.filter((alumnus) => alumnus.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, filter, universityAlumni, departmentAlumni]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center mx-8 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-8xl ml-60 p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-700">Alumni Network</h2>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              className="px-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search alumni by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-2 right-4 text-gray-500" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("university")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "university" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              University Alumni
            </button>
            <button
              onClick={() => setFilter("department")}
              className={`px-4 py-2 rounded-lg transition ${
                filter === "department" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              Department Alumni
            </button>
          </div>
        </div>

        {/* Loading & Error Handling */}
        {loading && <p className="text-center text-gray-500">Loading alumni data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Alumni List */}
        {!loading && (
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${filter === "university" ? "text-blue-700" : "text-green-700"}`}>
              {filter === "university" ? `University Community -` : `Department Alumni -`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.length === 0 ? (
                <p className="text-center text-gray-500">No alumni found.</p>
              ) : (
                filteredAlumni.map((alumnus) => (
                  <div
                    key={alumnus.user_id}
                    className="bg-gray-50 shadow-md rounded-lg p-4 transition hover:shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={alumnus.profile_picture || "/default-avatar.png"}
                        alt={alumnus.name}
                        className="w-12 h-12 rounded-full border"
                      />
                      <div>
                        <h3 className="text-lg font-semibold">{alumnus.name}</h3>
                        <p className="text-gray-500">{alumnus.degree}</p>
                        <p className="text-sm text-gray-700">{alumnus.graduation_year}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                    <Link
  to={`/user/${alumnus.user_id}`}
  className="text-blue-500 hover:text-blue-700 underline"
>
  View Profile
</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlumniNet;
