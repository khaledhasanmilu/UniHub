import React from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import Cookies from 'js-cookie';

const dummyMessages = [
    { id: 1, sender: 'arosh', text: 'Hey there!' },
    { id: 2, sender: 'Bob', text: 'Hello! How are you?' },
    { id: 3, sender: 'arosh', text: 'I am good, thanks! What about you?' },
    { id: 4, sender: 'Bob', text: 'I am doing well, thank you!' },
    { id: 5, sender: 'arosh', text: 'That is great to hear!' },
    { id: 6, sender: 'Bob', text: 'Yes, it is!' },
    { id: 7, sender: 'arosh', text: 'Bye!' },
    { id: 8, sender: 'Bob', text: 'Goodbye!' },
    { id: 9, sender: 'arosh', text: 'Hey there!' },
    { id: 10, sender: 'Bob', text: 'Hello! How are you?' },
];

function MessageContainer({ userId }) {
  // Get the current user from cookies
  const currentUser = Cookies.get('username') || 'Guest';

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-white shadow-md rounded-md">
      {/* Top Bar with Name */}
      <div className="bg-blue-500 text-white text-center text-lg font-semibold p-3 rounded-t-md">
        {userId} {/* Chatting with userId */}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100 h-[380px] scrollbar-hide">
        {dummyMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 max-w-[60%] text-white rounded-lg ${
                msg.sender === currentUser ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white flex items-center border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none"
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default MessageContainer;
