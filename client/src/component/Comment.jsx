// src/component/Comment.jsx
import React, { useState } from 'react';

const Comment = ({ commentData, onAddReply }) => {
  const [replyInput, setReplyInput] = useState('');
  const [activeReply, setActiveReply] = useState(null); // Track which comment is being replied to

  // Handle adding a reply
  const handleAddReply = (commentIndex) => {
    if (replyInput) {
      onAddReply(commentIndex, replyInput);  // Pass reply to parent handler
      setReplyInput('');
      setActiveReply(null);  // Close reply input
    }
  };

  return (
    <div className="border-b py-2">
      <div className="flex items-center">
        {/* Comment User Image */}
        <img 
          src={commentData.userImage} 
          alt="User" 
          className="w-8 h-8 rounded-full mr-3" 
        />
        <div>
          <div className="font-semibold">{commentData.username}</div>
          <p className="text-gray-500">{commentData.content}</p>
        </div>
      </div>

      {/* Reply Button */}
      <button 
        onClick={() => setActiveReply(commentData.index)} 
        className="text-sm text-blue-500 mt-2"
      >
        Reply
      </button>

      {/* Reply Section */}
      {commentData.replies.length > 0 && (
        <div className="mt-2 pl-4">
          {commentData.replies.map((reply, replyIndex) => (
            <div key={replyIndex} className="flex items-center">
              {/* Reply User Image */}
              <img 
                src={reply.userImage} 
                alt="User" 
                className="w-8 h-8 rounded-full mr-3" 
              />
              <div>
                <div className="font-semibold">{reply.username}</div>
                <p className="text-gray-500">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Input */}
      {activeReply === commentData.index && (
        <div className="mt-2">
          <input 
            type="text" 
            placeholder="Write a reply..." 
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            className="w-full p-2 border rounded-md"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddReply(commentData.index);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Comment;
