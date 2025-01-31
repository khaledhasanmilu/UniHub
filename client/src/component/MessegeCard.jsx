import React from 'react';

function MessegeCard({ name, image }) {
  return (
    <div className="flex items-center bg-slate-400 rounded-md p-3 m-2">
      <img
        src={image || "https://via.placeholder.com/40"} // Default image
        alt="Profile"
        className="w-10 h-10 rounded-full mr-3"
      />
      <div className="text-white font-semibold">{name || "Unknown"}</div>
    </div>
  );
}

export default MessegeCard;
