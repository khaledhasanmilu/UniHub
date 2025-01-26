import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Comment from './Comment';
import Cookies from 'js-cookie';
import axios from 'axios';
import moment from 'moment';
import Modal from '../component/Model';
import { FaHeart, FaRegHeart } from 'react-icons/fa';  // Love icon

const Post = ({ userName, time, content, image, userImage, likes, postId, userId, userLiked, comment }) => {
  const navigate = useNavigate();
  const [like, setLike] = useState(Number(likes) || 0);
  const [liked, setLiked] = useState(!!userLiked);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Fetch comments when the post is loaded
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/post/getComments/${postId}`);
        setComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleLike = async () => {
    const originalLiked = liked;
    const originalLikeCount = like;

    setLiked(!originalLiked);
    setLike(originalLiked ? like - 1 : like + 1);

    try {
      await axios.post('http://localhost:5000/api/post/updateLike', {
        postId,
        userId: Cookies.get('uid'),
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
  
    if (commentInput.trim()) {
      const newComment = {
        username: cookieUsername,
        content: commentInput,
        userImage: storedProfileImage,
      };
  
      // Add the new comment to the current list
      setComments((prevComments) => [...prevComments, newComment]);
  
      try {
        await axios.post('http://localhost:5000/api/post/addComment', {
          postId,
          userId: uid,
          content: commentInput,
          userImage: storedProfileImage,
          username: cookieUsername,
        });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
  
      setCommentInput('');
    }
  };
  
  return (
    <>
      <div className={`bg-white shadow-md p-6 mb-6 rounded-md max-w-xl mx-auto cursor-pointer ${image ? '' : 'w-full'}`} onClick={() => setShowModal(true)}>
        <div className="flex items-center mb-4">
          <img src={userImage} alt={`${userName}'s profile`} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <div className="text-xl font-semibold text-blue-500" onClick={(e) => { e.stopPropagation(); navigate(`/user/${userId}`); }}>{userName}</div>
            <div className="text-gray-500 text-sm">{moment.utc(time).local().fromNow()}</div>
          </div>
        </div>
        <p className="mb-4">{content}</p>
        {image && <img src={image} alt="Post" className="w-full h-64 object-cover rounded-md" />}
        <div className="flex justify-between items-center mt-4">
          <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className={`text-red-500 ${liked ? 'text-red-600' : '' } flex items-center gap-2 justify-center`}>
            {liked ? <FaHeart /> : <FaRegHeart />}{like}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setShowModal(true); }} className="text-blue-500">
            Comment ({comment})
          </button>
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className={`bg-white p-6 rounded-lg shadow-lg ${image ? 'max-w-6xl w-[90vw]' : 'max-w-2xl w-[80vw]'} h-[85vh] flex flex-col overflow-hidden relative`}>
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              
              {/* Conditional Layout: Apply specific layout when image is available */}
              {image ? (
                <div className="flex w-full">
                  <div className="w-1/2 flex flex-col justify-center items-center">
                    <img src={image} alt="Post" className="w-full h-[70vh] object-cover rounded-md" />
                  </div>
                  <div className="w-2/3 pl-8">
                  <div className="text-lg font-semibold text-blue-500 mt-4">{userName}</div>
                  <div className="text-gray-500 text-sm">{moment.utc(time).local().fromNow()}</div>
                 
                    <p className="mb-4">{content}</p>
                    <h4 className="font-semibold text-lg mt-4">Comments</h4>
                    <ul className="mt-2 max-h-64 overflow-y-auto">
                      {comments.map((comment, index) => (
                        <li key={index}>
                          <Comment commentData={comment} />
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
                </div>
              ) : (
                <div className="flex flex-col w-full overflow-y-auto">
                  <div className="flex items-center mb-4">
                    <img src={userImage} alt={`${userName}'s profile`} className="w-12 h-12 rounded-full mr-3" />
                    <div>
                      <div className="text-lg font-semibold text-blue-500">{userName}</div>
                      <div className="text-gray-500 text-sm">{moment.utc(time).local().fromNow()}</div>
                    </div>
                  </div>
                  <p className="mb-4">{content}</p>
                  <h4 className="font-semibold text-lg mt-4">Comments</h4>
                  <ul className="mt-2 max-h-64 overflow-y-auto">
                    {comments.map((comment, index) => (
                      <li key={index}>
                        <Comment commentData={comment} />
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
          </div>
        </Modal>
      )}
    </>
  );
};

export default Post;
