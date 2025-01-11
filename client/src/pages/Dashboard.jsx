import React, { useState, useEffect } from 'react';
import axios from 'axios';   // Import Axios
import Post from '../component/Post';         // Post component
import CreatePost from '../component/CreatePost';
import Cookies from 'js-cookie';
import {Helmet} from "react-helmet";
const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const userid = Cookies.get('uid'); // Add this line to get the user ID from local storage

    useEffect(() => {
        const uni = localStorage.getItem('university');
        const data = {
            university: uni,
            user_id: userid,
        };

        const generatePosts = async () => {
            setLoading(true);
            try {
                // Make the Axios request to your backend
                const response = await axios.post('http://localhost:5000/api/post/uniPost', data, {
                    withCredentials: true,
                })
                console.log(data);
                if (response.data.success) {
                    setPosts(response.data.posts);
                    console.log(response.data.posts);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        generatePosts();
    }, [userid]);

    // Handle adding a new post
    const handleCreatePost = (newPost) => {
        setPosts([newPost, ...posts]); // Add the new post to the beginning of the posts array
    };

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Helmet>
                <title>UniHub</title>
            </Helmet>
           

            {/* Main Content Section */}
            <div className="flex-1">

                {/* Main Feed Area */}
                <div className="p-2">
                    {/* Centered Feed */}
                    <div className="max-w-4xl mx-auto">
                        {/* Create Post Section */}
                        <CreatePost onCreatePost={handleCreatePost} />

                        {/* Post Feed */}
                        {loading ? (
                            <div className="text-center text-gray-500">Loading posts...</div>
                        ) : (
                            posts.length > 0 ? (
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
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
