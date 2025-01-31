import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import { FaUniversity, FaUsers } from "react-icons/fa";
import Post from "../component/Post";
import CreatePost from "../component/CreatePost";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("university");

  const userId = Cookies.get("uid");
  const university = localStorage.getItem("university");

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId || !university) return;

      setLoading(true);
      try {
        const endpoint =
          filter === "university"
            ? "http://localhost:5000/api/post/uniPost"
            : "http://localhost:5000/api/post/followerPost";

        const response = await axios.post(
          endpoint,
          { university, user_id: userId },
          { withCredentials: true }
        );

        if (response.data.success) {
          setPosts(response.data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, university, filter]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start">
      <Helmet>
        <title>UniHub</title>
      </Helmet>

      {/* Navbar Placeholder */}
      <div className="h-16 w-full"></div>

      {/* Fixed Filter Icons on the Right */}
      <div className="fixed top-16 right-4 bg-white shadow-lg rounded-md p-2 flex flex-col items-center space-y-2 z-40">
        <button
          className={`p-2 rounded-md transition ${
            filter === "university" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("university")}
        >
          <FaUniversity className="text-xl" />
        </button>
        <button
          className={`p-2 rounded-md transition ${
            filter === "follower" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("follower")}
        >
          <FaUsers className="text-xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mt-20 px-4 flex flex-col items-center">
        <div className="w-full">
          <CreatePost onCreatePost={(newPost) => setPosts((prev) => [newPost, ...prev])} />
        </div>

        {/* Posts */}
        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.post_id} className="w-full">
              <Post
                userName={post.creator_name}
                time={post.created_at}
                likes={post.like_count}
                comment={post.comment_count}
                content={post.content}
                image={post.imageUrl}
                userImage={post.profile_picture || "https://via.placeholder.com/40"}
                postId={post.post_id}
                userId={post.creator_id}
                userLiked={post.user_liked === 1}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
