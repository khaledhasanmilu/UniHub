import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import RequestCard from '../component/RequestCard'; // Importing the RequestCard
import Cookies from 'js-cookie';


function GroupMate() {
    const userid = Cookies.get('uid');
    const username = Cookies.get('username');
    const uni = localStorage.getItem('university');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMyRequests, setViewMyRequests] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editRequest, setEditRequest] = useState(null); // To handle editing requests
    const [newRequest, setNewRequest] = useState({
        user_id: userid,
        username: username,
        project_name: '',
        course_name: '',
        semester: '',
        description: '',
        end_time: ''
    });

    const [requests, setRequests] = useState([]); // Holds all requests

    useEffect(() => {
        // Fetch data from backend
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/team/requests/${uni}`,{
                  withCredentials: true,
                });
                setRequests(response.data); // Assuming the data is an array of requests
            } catch (error) {
                console.error("Error fetching requests:", error);
            }
        };

        fetchRequests();
    }, []); // Empty dependency array ensures this effect runs only once when the component mounts

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = () => {
        console.log('Search query:', searchQuery);
    };

    const handleCreateRequest = () => {
        setEditRequest(null); // Ensure we are not editing an existing request
        setNewRequest({
            user_id: userid,
            username: username,
            project_name: '',
            course_name: '',
            semester: '',
            description: '',
            end_time: ''
        });  // Reset new request state
        setShowModal(true);  // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false);  // Close the modal
    };

    const handleToggleMyRequests = () => {
        setViewMyRequests(!viewMyRequests);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitRequest = async () => {
      const requestData =  newRequest;
      try {
          const url = editRequest 
              ? `http://localhost:5000/api/team/requests/${editRequest.request_id}` // Update request endpoint
              : "http://localhost:5000/api/team/requests"; // Create request endpoint
  
          const method = editRequest ? 'put' : 'post'; // Use PUT for update, POST for create
          const response = await axios[method](url, requestData);
          
          if (response.status === (editRequest ? 200 : 201)) {
              // Successfully created or updated the request
              if (editRequest) {
                  setRequests(prevRequests => prevRequests.map(request => String(request.request_id) === String(editRequest.request_id) ? requestData : request));
              } else {
                  setRequests([...requests, response.data]);
              }
              console.log(editRequest?"edited":"created");
              setShowModal(false);
            
          }
      } catch (error) {
          console.error("Error submitting request:", error);
      }
  };
  

  const handleEditRequest = (request) => {
    setEditRequest(request); // Set the request to be edited
    console.log(request.request_id);
    setNewRequest({
      request_id: request.id,
      user_id: request.user_id,
      username: request.username,
      project_name: request.project_name,
      course_name: request.course_name,
      semester: request.semester,
      description: request.description,
      end_time: request.end_time
    }); // Pre-fill the form with the request data using a copy
    setShowModal(true);  // Show the modal
};

    const handleDeleteRequest = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this request?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/team/requests/${id}`);
                if (response.status === 200) {
                    // Successfully deleted the request, update the requests list
                    setRequests(requests.filter(request => request.request_id !== id));
                }
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
    };

    // Filter the requests based on the search query and "view my requests" flag
    const filteredRequests = requests.filter(request => {
        // Filter by search query
        const searchMatch = (
          (request.project_name && request.project_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (request.course_name && request.course_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (request.semester && request.semester.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (request.description && request.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      

        // Filter by viewMyRequests flag
        const userMatch = viewMyRequests ? String(request.user_id) === userid : true;

        return searchMatch && userMatch;
    });
    return (
        <div className="min-h-screen flex bg-gray-100 px-8">
            <div className="flex-1">
                <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
                    <h2 className="text-2xl text-center font-semibold mb-6">Find TeamMate's</h2>

                    {/* Filters and Buttons */}
                    <div className="mb-6 flex justify-between items-center gap-4">
                        <button
                            onClick={handleCreateRequest}
                            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
                        >
                            <FaPlus className="mr-2" />
                            Create Request
                        </button>

                        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="text-sm w-60 p-1 border-none focus:outline-none"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </div>

                        <button
                            onClick={handleToggleMyRequests}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            {viewMyRequests ? 'View All Requests' : 'My Requests'}
                        </button>
                    </div>

                    {/* Content Area */}
                    <div>
                        {viewMyRequests ? (
                            <p>Displaying only my requests...</p>
                        ) : (
                            <p>Displaying all requests...</p>
                        )}

                        {/* Render Request Cards */}
                        <div>
                            {filteredRequests.map((request, index) => (
                                <div key={index} className="relative">
                                    <RequestCard request={request} />
                                    {/* Edit and Delete Buttons */}
                                    {String(request.user_id )=== userid && (
                                        <div className="absolute top-0 right-0 m-4 flex gap-2">
                                            <button
                                                onClick={() => handleEditRequest(request)}
                                                className="bg-yellow-600 text-white px-2 py-1 rounded-md hover:bg-yellow-700"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRequest(request.request_id)}
                                                className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96">
                        <h2 className="text-2xl font-semibold mb-4">{editRequest ? 'Edit Request' : 'Create Request'}</h2>

                        {/* Input Fields */}
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Project Name:</label>
                            <input
                                type="text"
                                name="project_name"
                                value={newRequest.project_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Course Name:</label>
                            <input
                                type="text"
                                name="course_name"
                                value={newRequest.course_name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Semester:</label>
                            <input
                                type="text"
                                name="semester"
                                value={newRequest.semester}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">Description:</label>
                            <textarea
                                name="description"
                                value={newRequest.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium">End Time:</label>
                            <input
                                type="date"
                                name="end_time"
                                value={newRequest.end_time}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={handleSubmitRequest}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {editRequest ? 'Update' : 'Submit'}
                            </button>
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GroupMate;
