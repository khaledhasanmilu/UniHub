import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Post from '../component/Post';
import CreatePost from '../component/CreatePost';
import { Helmet } from 'react-helmet';
import ProfileCard from '../component/ProfileCard';

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
        console.log(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
      <Helmet>
        <title>UniHub - Profile</title>
      </Helmet>
      {/* Sidebar Section */}
      {/* Main Content Section */}
      <div className="flex-1 ">
     

        <div className="bg-white shadow-md rounded-md max-w-4xl mx-80 w-full p-16">
          {/* Profile Header */}
          <ProfileCard id={userid}/>

          
       

          {/* Posts Feed */}
          <div className="mt-8">
            <h2 className="text-2xl text-center font-semibold mb-4">Your Posts</h2>
            <CreatePost/>

            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post.PostID}
                  userName={post.creator_name}
                  time={post.created_at}
                  likes={post.like_count}
                  comment={post.comment_count}
                  content={post.content}
                  image={post.imageUrl}
                  userImage={post.profile_picture || 'https://via.placeholder.com/40'}
                  postId={post.post_id}
                  userId={userid}
                  userLiked={(post.user_liked===1)?true:false}
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
