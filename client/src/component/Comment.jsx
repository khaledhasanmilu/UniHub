import React from 'react';

const Comment = ({ commentData }) => {
  if (!commentData) return null; // Prevents accessing undefined properties

  return (
    <div className="border-b py-2">
      <div className="flex items-center">
        {/* Comment User Image */}
        <img 
          src={commentData.userImage || '/default-avatar.png'} 
          alt="User" 
          className="w-8 h-8 rounded-full mr-3" 
        />
        <div>
          <div className="font-semibold">{commentData.username || 'Anonymous'}</div>
          <p className="text-gray-500">{commentData.content || 'No content available'}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
