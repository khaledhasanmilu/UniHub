import React, { useState, useEffect } from 'react';
import Sidebar from './component/Sidebar';   // Sidebar component
import Navbar from './component/Navbar';     // Navbar component
import Post from './component/Post';         // Post component
import CreatePost from './component/CreatePost'
const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generatePosts = async () => {
            setLoading(true);
            try {
                const numPosts = 10; // Number of dummy posts
                const fetchPromises = Array.from({ length: numPosts }, () =>
                    fetch('https://picsum.photos/600/300')
                );

                const responses = await Promise.all(fetchPromises);
             

                const fetchedPosts = responses.map((response, i) => ({
                    userName: `User ${i + 1}`,
                    time: `${Math.floor(Math.random() * 10)} hours ago`,
                    content: `This is a dummy post content for post ${i + 1}.`,
                    image: response.ok ? response.url : '/img/default.jpg', // Fallback image
                    userImage: '/img/post/student.jpg', // Dummy user image
                }));

                setPosts(fetchedPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        generatePosts();
    }, []);

    // Handle adding a new post
    const handleCreatePost = (newPost) => {
        setPosts([newPost, ...posts]); // Add the new post to the beginning of the posts array
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar Section */}
            <Sidebar />

            {/* Main Content Section */}
            <div className="flex-1 ">
                {/* Full-width Navbar */}
                <Navbar />

                {/* Main Feed Area */}
                <div className="p-6">
                    {/* Centered Feed */}
                    <div className="max-w-4xl mx-auto">
                        {/* Create Post Section */}
                        <CreatePost onCreatePost={handleCreatePost} />

                        {/* Post Feed */}
                        {loading ? (
                            <div className="text-center text-gray-500">Loading posts...</div>
                        ) : (
                            posts.map((post, index) => (
                                <Post
                                    key={index}
                                    userName={post.userName}
                                    time={post.time}
                                    content={post.content}
                                    image={post.image}
                                    userImage={post.userImage}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
