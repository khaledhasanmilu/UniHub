import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import axios from 'axios';

const CreatePost = ({ onCreatePost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('Guest');
    const [uid, setUid] = useState(null);
    const [userImage, setUserImage] = useState('./img/post/student.jpg'); // Default image

    useEffect(() => {
        const cookieUsername = Cookies.get('username');
        const cookieUid = Cookies.get('uid');
        if (cookieUsername) {
            setUsername(cookieUsername);
        }
        if (cookieUid) {
            setUid(cookieUid);
        }

        // Check if a user image is stored in localStorage
        const storedUserImage = localStorage.getItem('userImageUrl');
        if (storedUserImage) {
            setUserImage(storedUserImage); // Set the user image from localStorage
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert("Please upload a valid image file.");
                return;
            }
            setImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        const currentTime = moment().fromNow();
        const formData = new FormData();

        formData.append('content', content);
        formData.append('userId', uid);
        formData.append('time', currentTime);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/post/createPost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Post created:', response.data);
            const userImageUrl = localStorage.getItem('userImageUrl'); // Retrieve user image from localStorage

            onCreatePost({
                userName: username,
                time: currentTime,
                content: response.data.content,
                image: response.data.imageUrl,
                userImage: userImageUrl || './img/post/student.jpg', // Use the stored image URL or fallback
            });

            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="bg-white shadow-md p-6 mb-6 rounded-md max-w-xl mx-auto">
            <div className="flex items-center mb-4">
                {/* User Image */}
                <img 
                    src={userImage}  // Dynamically set the user image from localStorage
                    alt="User" 
                    className="w-12 h-12 rounded-full mr-4" 
                />
                <div>
                    <div className="text-xl font-semibold">{username}</div>
                    <div className="text-gray-500 text-sm">Creating a post...</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    rows="3"
                />

                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imageUpload"
                    />
                    <label
                        htmlFor="imageUpload"
                        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-600"
                    >
                        Upload Image
                    </label>
                    {image && (
                        <div className="mt-2">
                            <img
                                src={URL.createObjectURL(image)} // Display the uploaded image preview
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
