import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Post from './component/Post';
import moment from 'moment';
import Navbar from './component/Navbar';
import Sidebar from './component/Sidebar';
import CreatePost from './component/CreatePost';

const ProfilePage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [userid, setUserid] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('./img/profile/default-avatar.jpg');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const cookieUsername = Cookies.get('username');
    const uid = Cookies.get('uid');
    const cookieEmail = Cookies.get('email');
    const storedProfileImage = localStorage.getItem('userImageUrl');

    if (cookieUsername) setUsername(cookieUsername);
    if (uid) setUserid(uid);
    if (cookieEmail) setEmail(cookieEmail);
    if (storedProfileImage) setProfileImage(storedProfileImage);

    fetchUserProfile();
    fetchUserPosts();
  }, [userid]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/profile/${userid}`);
      if (response.data.success) {
        setBio(response.data.user.bio || '');
        setPhone(response.data.user.phone || '');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/post/${userid}`);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewProfileImage(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (newProfileImage) formData.append('profileImage', newProfileImage);
    formData.append('bio', bio);
    formData.append('phone', phone);

    try {
      const response = await axios.post('http://localhost:5000/api/user/updateProfile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Profile updated successfully!');
        if (newProfileImage) {
          const imageUrl = URL.createObjectURL(newProfileImage);
          setProfileImage(imageUrl);
          localStorage.setItem('userImageUrl', imageUrl);
        }
        setIsEditing(false);
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!newPostContent.trim()) {
      alert('Post content is required.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userid);
    formData.append('content', newPostContent);
    if (newPostImage) formData.append('postImage', newPostImage);

    try {
      const response = await axios.post('http://localhost:5000/api/post/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setPosts([response.data.newPost, ...posts]);
        setNewPostContent('');
        setNewPostImage(null);
      } else {
        alert('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Section */}
      <Sidebar />
      {/* Main Content Section */}
      <div className="flex-1 ">
        {/* Full-width Navbar */}
        <Navbar />

        <div className="bg-white shadow-md rounded-md max-w-4xl mx-80 w-full p-16">
          {/* Profile Header */}
          <div className="flex items-center h-80 mb-6">
            <img
              src={profileImage}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-500"
            />
            <div className="flex-1">
              <div className="text-3xl font-semibold">{username}</div>
              <div className="text-lg text-gray-600">{email}</div>
              <div className="mt-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>

          
       

          {/* Posts Feed */}
          <div className="mt-8">
            <h2 className="text-2xl text-center font-semibold mb-4">Your Posts</h2>
            <CreatePost/>

            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.PostID}
                  userName={post.name}
                  time={moment(post.createdAt).fromNow()}
                  content={post.Content}
                  image={post.ImageURL}
                  userImage={post.userImage || 'https://via.placeholder.com/40'}
                />
              ))
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
