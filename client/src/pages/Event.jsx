import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Helmet from 'react-helmet';
import EventCard from '../component/EventCard';
import CreateEvent from '../component/CreateEvent';

const Event = () => {
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const university = localStorage.getItem('university');

  const filteredEvents = events.filter(
    (event) => filter === 'all' || event.event_type === filter
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/event/getEvent', { filter: 'all',university:university });
        setEvents(response.data.events); // Assuming response contains an `events` array
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleCreate = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };


  return (
    <div className="min-h-screen flex bg-gray-100 mx-8">
      <Helmet>
        <title>UniHub - Event</title>
      </Helmet>

      <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
          <h2 className="text-2xl text-center font-semibold mb-6">Events</h2>

            {/* Create Event Form */}
            <CreateEvent onCreate={handleCreate} />

          {/* Filter Buttons */}
          <div className="flex justify-center mb-6">
            {['all', 'intra-university', 'inter-university'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`py-2 px-4 mx-2 rounded-md ${
                  filter === type ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Event Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={(e) => setSelectedEvent(e)}
              />
            ))}
          </div>

         
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          onClick={() => setSelectedEvent(null)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-8 rounded-md max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <p className="text-gray-700 mb-2">{selectedEvent.description}</p>
            <p className="text-gray-600 mb-2">Venue: {selectedEvent.venue}</p>
            <p className="text-gray-500">
              {selectedEvent.startDate} - {selectedEvent.endDate}
            </p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Event;
