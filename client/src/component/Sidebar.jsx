// src/component/Sidebar.jsx
import React from 'react';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4">
      <div className="space-y-6">
        <div className="text-xl font-semibold">Dashboard</div>
        <ul className="space-y-4">
          <li><button className="w-full text-left">Feed</button></li>
          <li><button className="w-full text-left">Messages</button></li>
          <li><button className="w-full text-left">Events</button></li>
          <li><button className="w-full text-left">Groups</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
