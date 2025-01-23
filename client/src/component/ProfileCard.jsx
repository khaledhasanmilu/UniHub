import React, { useState, useEffect } from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaUserPlus, FaUsers, FaEdit, FaCamera } from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

function ProfileCard({ id }) {
    const [followers, setFollowers] = useState(100);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        degree: '',
        university: '',
        graduationYear: '',
        bio: '',
        profilePicture: '',
        twitter: '',
        linkedin: '',
        github: '',
        skills: '',

    });

    const currentUserId = Cookies.get('uid'); // Assume the current user is fetched from cookies

    useEffect(() => {
        fetchProfileData();
    }, [id]); // Fetch profile data when `id` changes

  

    const fetchProfileData = async () => {
        
        try {
            const response = await axios.get(`http://localhost:5000/api/user/details/${id}`, {
                params: { currentUserId }
            });
            setProfile(response.data);
            setFollowers(response.data.followers ?? 0);
            setIsFollowing(response.data.isFollowing === 1);
            
    
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };
    

    const handleFollow = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/api/user/follow/${id}`, {
                userId: currentUserId,
                action: isFollowing ? 'unfollow' : 'follow'
            });
            if (response.status === 200) {
                setFollowers(isFollowing ? followers - 1 : followers + 1);
                setIsFollowing(!isFollowing);
            }
        } catch (error) {
            console.error("Error following/unfollowing:", error);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCloseEdit = () => {
        setIsEditing(false);
    };

    const handleProfilePictureEdit = () => {
        setIsUploading(true);
    };

    const handleCloseUpload = () => {
        setIsUploading(false);
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleProfilePictureUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Here, send the file to your backend to save
            const formData = new FormData();
            formData.append('profilePicture', file);
            formData.append('userId', id);
            try {
                const response = await axios.post(`http://localhost:5000/api/user/upload-picture`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.status === 200) {
                    setProfile({ ...profile, profilePicture: response.data.profilePictureUrl });
                    setIsUploading(false);
                }
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                setIsUploading(false);
            }
        }
    };
    const handleUpdateClick = async () => {
        
        const data = {
            
            userId: id,
            degree: profile.degree,
            graduationYear: profile.graduationYear,
            skills: profile.skills,
            bio: profile.bio,
            twitter: profile.twitter,
            linkedin: profile.linkedin,
            github: profile.github
            
        };
        try {
            const response = await axios.post(`http://localhost:5000/api/user/updateProfile`, data);
            if (response.status === 200) {
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    }
    
    return (
        <div>
            <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200 p-6 flex items-center relative '}">
            <div className='relative'>
                <img 
                    src={profile.profilePicture || 'default-profile-picture-url'} 
                    alt={profile.name} 
                    className="w-48 h-48 rounded-full border-4 border-gray-300"
                />
                {currentUserId === id && (
                    <button className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full" onClick={handleProfilePictureEdit}>
                        <FaCamera />
                    </button>
                )}
            </div>
            
            <div className="ml-6 flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600">{profile.degree}</p>
                <p className="text-gray-600">University: {profile.university}</p>
                <p className="text-gray-500">Class of : {profile.graduationYear}</p>
                <p className=' text-gray-500'>Skills : {profile.skills}</p>
                <p className="mt-4 text-gray-700">{profile.bio}</p>
                
                <div className="mt-4 flex space-x-4">
                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center space-x-1">
                        <FaTwitter /> <span>Twitter</span>
                    </a>
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center space-x-1">
                        <FaLinkedin /> <span>LinkedIn</span>
                    </a>
                    <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline flex items-center space-x-1">
                        <FaGithub /> <span>GitHub</span>
                    </a>
                </div>
            </div>
            
            <div className="ml-6 flex flex-col items-center">
            <button 
    onClick={handleFollow} 
    className={`px-4 py-2 rounded-full text-white flex items-center space-x-2 transition ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
    disabled={currentUserId === id} // Disable if currentUserId and id are the same
>
    <FaUserPlus />
    <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
</button>
                <p className="mt-2 text-gray-600 flex items-center space-x-2">
                    <FaUsers /> <span>Followers: {followers}</span>
                </p>
            </div>

            {currentUserId === id && (
                <button onClick={handleEditClick} className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
                    <FaEdit size={20} />
                </button>
            )}

            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                        
                        <input type="text" name="degree" value={profile.degree} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Degree" />
                        <input type="text" name="graduationYear" value={profile.graduationYear} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Year of Graduation" />
                        <input type="text" name="skills" value={profile.skills} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Skills" />
                        <textarea name="bio" value={profile.bio} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Bio"></textarea>
                        <input type="text" name="twitter" value={profile.twitter} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="Twitter URL" />
                        <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="LinkedIn URL" />
                        <input type="text" name="github" value={profile.github} onChange={handleChange} className="w-full p-2 mb-2 border rounded" placeholder="GitHub URL" />
                       
                        <button onClick={handleCloseEdit} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded w-full">Close</button>
                        <button onClick={handleUpdateClick} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full">Update</button>
                    </div>
                </div>
            )}

            {isUploading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Upload Profile Picture</h2>
                        <input type="file" onChange={handleProfilePictureUpload} className="w-full mb-4" />
                        <button onClick={handleCloseUpload} className="px-4 py-2 bg-gray-500 text-white rounded w-full">Cancel</button>
                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded w-full">Upload</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default ProfileCard;
