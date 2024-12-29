// src/component/Post.jsx
import React, { useState } from 'react';
import Comment from './Comment';  // Import the Comment component

const Post = ({ userName, time, content, image, userImage }) => {
  // State for like functionality
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // State for comment functionality
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false); // State for toggling comment section visibility
  const [commentInput, setCommentInput] = useState(''); // State for handling new comment input

  // Handle like button click
  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1); // Toggle like count
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (commentInput) {
      const newComment = {
        username: 'CurrentUser',  // Replace with actual username
        content: commentInput,
        userImage: 'https://via.placeholder.com/40', // Add user image for the comment
        replies: [],
        index: comments.length // Track index for reply purposes
      };
      setComments([...comments, newComment]);
      setCommentInput('');
    }
  };

  // Handle adding a reply to a comment
  const handleAddReply = (commentIndex, replyContent) => {
    const updatedComments = [...comments];
    updatedComments[commentIndex].replies.push({
      username: 'CurrentUser',  // Replace with actual username
      content: replyContent,
      userImage: 'https://via.placeholder.com/40', // Add user image for the reply
    });
    setComments(updatedComments);
  };

  return (
    <div className="bg-white shadow-md p-6 mb-6 rounded-md max-w-xl mx-auto">
      <div className="flex items-center mb-4">
        {/* User Image */}
        <img 
          src={userImage} 
          alt="User" 
          className="w-12 h-12 rounded-full mr-4" 
        />
        <div>
          <div className="text-xl font-semibold">{userName}</div>
          <div className="text-gray-500 text-sm">{time}</div>
        </div>
      </div>
      
      <div className="mb-4">
        <p>{content}</p>
      </div>
      
      {/* Post Image */}
      {image && <img src={image} alt="Post image" className="w-full h-64 object-cover rounded-md" />}
      
      {/* Actions: Like and Comment */}
      <div className="flex justify-between items-center mt-4">
        {/* Like Button */}
        <button 
          onClick={handleLike}
          className={`text-blue-500 ${liked ? 'font-bold' : ''}`}
        >
          {liked ? 'Unlike' : 'Like'} ({likes})
        </button>

        {/* Comment Button */}
        <button 
          onClick={() => setShowComments(!showComments)} // Toggle comment section visibility
          className="text-blue-500"
        >
          {showComments ? 'Hide Comments' : 'Comment'} ({comments.length})
        </button>
      </div>

      {/* Conditionally render the comment section */}
      {showComments && (
        <div className="mt-4">
          {comments.length > 0 && (
            <div>
              <h4 className="font-semibold text-lg">Comments</h4>
              <ul className="mt-2">
                {comments.map((comment, index) => (
                  <li key={index}>
                    <Comment 
                      commentData={comment} 
                      onAddReply={handleAddReply} 
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add Comment */}
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="Add a comment..." 
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full p-2 border rounded-md"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
