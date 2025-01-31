import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Sidebar from '../component/Sidebar';
import Navbar from '../component/Navbar';
import { Helmet } from "react-helmet";
import { Outlet } from 'react-router-dom'; // For dynamic content rendering

const Structure = () => {
    const navigate = useNavigate();
    const role = Cookies.get('role');

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        
        // Redirect to login if not authenticated
        if (!authToken) {
            navigate('/login');
            return;
        }

        // Redirect admin users to /admin
        if (role === 'admin') {
            navigate('/admin');
            return;
        }
    }, [navigate, role]);

    return (
        <div className="min-h-screen flex bg-gray-100">
            <Helmet>
                <title>UniHub</title>
            </Helmet>

            {/* Sidebar Section */}
            <Sidebar />
            
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
