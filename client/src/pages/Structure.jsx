import React from 'react';
import Sidebar from '../component/Sidebar';
import Navbar from '../component/Navbar';
import { Helmet } from "react-helmet";
import { Outlet } from 'react-router-dom'; // For dynamic content rendering
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const Structure = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const authToken = Cookies.get('authToken');
    console.log('authToken:', authToken);
    if (!authToken) {
        navigate('/login');
    }
  }, [navigate]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Helmet>
                <title>UniHub</title>
            </Helmet>
            <Sidebar/>
            
            {/* Sidebar Section */}
           
            {/* Main Content Section */}
            <div className="w-full">
                {/* Full-width Navbar */}
                <Navbar />


                {/* Main Feed Area */}
                <div>
                    {/* Dynamic Content Area */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Structure;