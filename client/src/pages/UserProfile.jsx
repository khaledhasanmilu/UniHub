import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../component/Post';
import CreatePost from '../component/CreatePost';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  const user_id = useParams().id;
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    
 
    fetchUserPosts();
  }, [user_id]);



  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/post/${user_id}`);
      if (response.data.success) {
        setPosts(response.data.posts);
        console.log(response.data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
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
     

        <div className="bg-white shadow-md rounded-md max-w-6xl ml-60 w-full p-6 h-max">
       

          {/* Posts Feed */}
          <div className="mt-8">
            <h2 className="text-2xl text-center font-semibold mb-4"> Your Friend Posts</h2>
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
                  userId={user_id}
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

export default UserProfile;
