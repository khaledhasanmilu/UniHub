import React from 'react';

function CreateRequest({ showModal, setShowModal, handleSubmit, handleChange, newRequest }) {
  return (
    showModal && (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h3 className="text-2xl font-semibold mb-4">Create New Request</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600">Project Name</label>
              <input
                type="text"
                name="projectName"
                value={newRequest.projectName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter project name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Course Name</label>
              <input
                type="text"
                name="courseName"
                value={newRequest.courseName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter course name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Semester</label>
              <input
                type="text"
                name="semester"
                value={newRequest.semester}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter semester"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">Description</label>
              <textarea
                name="description"
                value={newRequest.description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter description"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600">End Time</label>
              <input
                type="date"
                name="endTime"
                value={newRequest.endTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}

export default CreateRequest;
