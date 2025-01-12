import React, { useState } from 'react';
import Comment from './Comment';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';

const Post = ({ userName, time, content, image, userImage, likes, postId, userId, userLiked, comment }) => {
  const [like, setLike] = useState(Number(likes) || 0);
  const [liked, setLiked] = useState(!!userLiked);

  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const handleLike = async () => {
    const originalLiked = liked;
    const originalLikeCount = like;

    setLiked(!originalLiked);
    setLike(originalLiked ? like - 1 : like + 1);

    try {
      await axios.post('http://localhost:5000/api/post/updateLike', {
        postId,
        userId,
        liked: !originalLiked,
      });
    } catch (error) {
      console.error('Error updating like status:', error);
      setLiked(originalLiked);
      setLike(originalLikeCount);
    }
  };

  const handleAddComment = async () => {
    const cookieUsername = Cookies.get('username');
    const uid = Cookies.get('uid');
    const storedProfileImage = localStorage.getItem('userImageUrl');
    console.log('storedProfileImage:', storedProfileImage);
  
    if (commentInput.trim()) {
      // Create a temporary comment to show in the UI
      const tempComment = {
        username: cookieUsername,
        content: commentInput,
        userImage: storedProfileImage,
        replies: [],
        isTemporary: true, // Mark it as temporary
      };
  
      // Add the temporary comment to the state
      const originalComments = [...comments];
      const updatedComments = [...comments, tempComment];
      setComments(updatedComments);
  
      try {
        // Make the API request to add the comment
        const response = await axios.post('http://localhost:5000/api/post/addComment', {
          postId,
          userId: uid,
          content: commentInput,
          userImage: storedProfileImage,
          username: cookieUsername,
        });
  
        // Replace the temporary comment with the actual comment from the response
        setComments([...originalComments, response.data]);
      } catch (error) {
        console.error('Error adding comment:', error);
  
        // Rollback: Remove the temporary comment
        setComments(originalComments);
      }
  
      // Clear the comment input
      setCommentInput('');
    }
  };

  return (
    <div className="bg-white shadow-md p-6 mb-6 rounded-md max-w-xl mx-auto">
      {/* Post Header */}
      <div className="flex items-center mb-4">
        <img src={userImage} alt={`${userName}'s profile`} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <div className="text-xl font-semibold">{userName}</div>
          <div className="text-gray-500 text-sm">{moment.utc(time).local().fromNow()}</div>
        </div>
      </div>

      {/* Post Content */}
      <p className="mb-4">{content}</p>
      {image && <img src={image} alt="Post" className="w-full h-64 object-cover rounded-md" />}

      {/* Actions */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleLike}
          className={`text-blue-500 ${liked ? 'font-bold' : ''}`}
          aria-label={liked ? 'Unlike this post' : 'Like this post'}
        >
          {liked ? 'Unlike' : 'Like'} ({like})
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-500"
          aria-label="Toggle comment section"
        >
          {showComments ? 'Hide Comments' : 'Comment'} ({comment})
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4">
          <h4 className="font-semibold text-lg">Comments</h4>
          <ul className="mt-2">
            {comments.map((comment, index) => (
              <li key={index}>
                <Comment commentData={{ ...comment, replies: comment.replies || [] }} onAddReply={handleAddReply} />
              </li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            className="w-full p-2 border rounded-md mt-4"
          />
        </div>
      )}
    </div>
  );
};

export default Post;
