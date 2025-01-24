import React, { useState } from 'react';
import { FaSearch, FaPlus, FaUser } from 'react-icons/fa';
import CreateRequest from '../component/CreateRequest';
import RequestCard from '../component/RequestCard';

function GroupMate() {
  const [requests, setRequests] = useState([
    { userId: 1, userName: 'Alice', projectName: 'AI Research', courseName: 'Artificial Intelligence', semester: 'Spring 2025', description: 'Looking for a team to work on an AI research project.', endTime: '2025-05-30' },
    { userId: 2, userName: 'Bob', projectName: 'Web Development', courseName: 'Web Programming', semester: 'Fall 2025', description: 'Need members for a web development project focused on building a modern web app.', endTime: '2025-06-15' },
    { userId: 4, userName: 'Charlie', projectName: 'Data Science', courseName: 'Data Science 101', semester: 'Winter 2025', description: 'Seeking group members for a data analysis project using Python.', endTime: '2025-04-01' },
  ]);

  const [newRequest, setNewRequest] = useState({ userId: 1, userName: 'Alice', projectName: '', courseName: '', semester: '', description: '', endTime: '' });
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMyRequests, setViewMyRequests] = useState(false);

  const handleChange = (e) => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequests([...requests, newRequest]);
    setNewRequest({ userId: 1, userName: 'Alice', projectName: '', courseName: '', semester: '', description: '', endTime: '' });
    setShowModal(false);
  };
  const handleEdit = (editedRequest) => {
    setRequests(
      requests.map((request) => (request.userId === editedRequest.userId && request.projectName === editedRequest.projectName ? editedRequest : request))
    );
  };

  const handleDelete = (request) => {
    setRequests(requests.filter((r) => r !== request));
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearchQuery =
      request.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMyRequests = viewMyRequests ? request.userId === 1 : true;

    return matchesSearchQuery && matchesMyRequests;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex px-8 py-2">
      <div className="flex-1">
        <div className="flex-1 max-w-6xl w-full bg-white shadow-xl mx-60 rounded-lg p-8">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Find Group Mates</h1>
          <p className="text-gray-600 text-center mb-6">
            Submit a request to find team members for your project or join existing teams!
          </p>

          {/* Search Bar, My Requests & Create Button in One Line */}
          <div className="flex justify-between items-center mb-6 space-x-4">
            {/* Create Request Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 text-sm"
            >
              <FaPlus className="mr-2" />
              Create Request
            </button>

            {/* Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-1/2">
              <FaSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                className="w-full text-sm border-none focus:outline-none"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* My Requests Button */}
            <button
              onClick={() => setViewMyRequests(!viewMyRequests)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm"
            >
              <FaUser className="mr-2" />
              {viewMyRequests ? 'View All Requests' : 'My Requests'}
            </button>
          </div>

          {/* Requests List */}
          <ul className="space-y-4 mt-6">
            {filteredRequests.map((request, index) => (
              <RequestCard key={index} request={request} handleDelete={handleDelete} handleEdit={handleEdit} />
            ))}
          </ul>

          {/* Create Request Modal */}
          <CreateRequest showModal={showModal} setShowModal={setShowModal} handleSubmit={handleSubmit} handleChange={handleChange} newRequest={newRequest} />
        </div>
      </div>
    </div>
  );
}

export default GroupMate;
