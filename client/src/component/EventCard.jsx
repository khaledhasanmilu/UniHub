import React, { useState } from 'react';

const EventCard = ({ event, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {/* Event Card */}
      <div
        onClick={toggleModal}
        className="cursor-pointer bg-white p-5 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-102"
      >
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-36 object-cover rounded-lg mb-4"
        />
        <div className="bg-white bg-opacity-80 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-4">{event.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-xs">
              {event.startDate} - {event.endDate}
            </span>
            <span className="text-blue-600 text-xs font-semibold cursor-pointer hover:text-blue-800 transition-all duration-200">
              View Details
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 max-h-[400px] overflow-auto">
            <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
            <p className="text-gray-500 text-xs mb-4">
              {event.startDate} - {event.endDate}
            </p>
            <button
              onClick={toggleModal}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
