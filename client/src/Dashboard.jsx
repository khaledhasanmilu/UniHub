// src/component/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './component/Sidebar';   // Sidebar component
import Navbar from './component/Navbar';     // Navbar component
import Post from './component/Post';         // Post component

const Dashboard = () => {

    const [posts, setPosts] = useState([]);
    useEffect(() => {
        // Function to generate a dummy post
        const generatePosts = async () => {
          const numPosts = 5; // Number of dummy posts
          const fetchedPosts = [];
          for (let i = 0; i < numPosts; i++) {
            // Fetch a random image from the Picsum API
            const response = await fetch('https://picsum.photos/600/300');
            const imageUrl = response.url;
    
            const post = {
              userName: `User ${i + 1}`,
              time: `${Math.floor(Math.random() * 10)} hours ago`,
              content: `This is a dummy post content for post ${i + 1}.`,
              image: imageUrl,
              userImage: 'https://via.placeholder.com/40', // Dummy user image
            };
    
            fetchedPosts.push(post);
          }
          setPosts(fetchedPosts);
        };
    
        generatePosts();
      }, []);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="flex-1 ml-64">
        {/* Full-width Navbar */}
        <Navbar />

        {/* Main Feed Area */}
        <div className="p-6">
          {/* Centered Feed */}
          <div className="max-w-4xl mx-auto">
            {/* Example Posts */}
            {posts.map((post, index) => (
          <Post
            key={index}
            userName={post.userName}
            time={post.time}
            content={post.content}
            image={post.image}
            userImage={post.userImage}
          />
        ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
