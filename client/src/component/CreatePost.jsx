import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import axios from 'axios';
import { FiImage } from 'react-icons/fi';

const CreatePost = ({ onCreatePost }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('Guest');
    const [uid, setUid] = useState(null);
    const [userImage, setUserImage] = useState('./img/post/student.jpg');

    useEffect(() => {
        const cookieUsername = Cookies.get('username');
        const cookieUid = Cookies.get('uid');
        if (cookieUsername) setUsername(cookieUsername);
        if (cookieUid) setUid(cookieUid);
        const storedUserImage = localStorage.getItem('userImageUrl');
        if (storedUserImage) setUserImage(storedUserImage);
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        const formData = new FormData();
        if (!uid || isNaN(uid)) {
            alert('Invalid user ID');
            return;
        }

        formData.append('content', content);
        formData.append('creator_id', parseInt(uid));
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5000/api/post/createPost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            onCreatePost({
                userName: username,
                time: moment().fromNow(),
                content: response.data.content,
                image: response.data.imageUrl,
                userImage: userImage || './img/post/student.jpg',
            });

            setContent('');
            setImage(null);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <div className="bg-white shadow-lg p-6 mb-6 rounded-lg max-w-xl mx-auto border border-gray-200">
            <div className="flex items-center mb-4">
                <img src={userImage} alt="User" className="w-12 h-12 rounded-full border border-gray-300" />
                <div className="ml-3">
                    <div className="text-lg font-semibold text-gray-800">{username}</div>
                    <div className="text-gray-500 text-sm">Share your thoughts...</div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                    rows="3"
                />

                <div className="flex items-center justify-between">
                    <label htmlFor="imageUpload" className="flex items-center gap-2 text-blue-500 cursor-pointer hover:text-blue-600">
                        <FiImage size={20} />
                        <span>Upload Image</span>
                    </label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                </div>

                {image && (
                    <div className="mt-2 border border-gray-300 rounded-md overflow-hidden w-32 h-32">
                        <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                    Post
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
