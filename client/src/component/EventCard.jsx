import React from 'react';

const EventCard = ({ event, onClick }) => {
  return (
    <div
      onClick={() => onClick(event)}
      className="cursor-pointer bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg"
    >
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <span className="text-gray-500 text-sm">
        {event.startDate} - {event.endDate}
      </span>
    </div>
  );
};

export default EventCard;
