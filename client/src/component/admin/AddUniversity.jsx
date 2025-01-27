import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUniversity = () => {
  const [universityName, setUniversityName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/university/list');
        setUniversities(response.data);
      } catch (error) {
        console.error(error);
        alert('Error fetching universities.');
      }
    };
    fetchUniversities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!universityName) {
      setError('University name is required.');
      return;
    }

    const universityData = {
      name: universityName,
      location: location || null,
      website: website || null,
    };

    try {
      await axios.post('http://localhost:5000/api/university/list', universityData);
      alert('University added successfully!');
      setUniversityName('');
      setLocation('');
      setWebsite('');
      setError('');

      const updatedUniversities = await axios.get('http://localhost:5000/api/university/list');
      setUniversities(updatedUniversities.data);
    } catch (err) {
      console.error(err);
      alert('Error adding university.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add University</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">University Name</label>
            <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-lg" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Website (Optional)</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="mt-1 p-2 w-full border border-gray-300 rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">Add University</button>
        </form>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">All Universities</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">University Name</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Website</th>
            </tr>
          </thead>
          <tbody>
            {universities.length > 0 ? (
              universities.map((university) => (
                <tr key={university.university_id}>
                  <td className="border px-4 py-2">{university.name}</td>
                  <td className="border px-4 py-2">{university.location || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {university.website ? (
                      <a href={university.website} target="_blank" rel="noopener noreferrer">{university.website}</a>
                    ) : ('N/A')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center border px-4 py-2">No universities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUniversity;
