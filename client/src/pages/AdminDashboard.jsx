import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/admin/Sidebar';
import DashboardContent from '../component/admin/DashboardContent';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = Cookies.get('role');
  const [selectedOption, setSelectedOption] = useState('dashboard');

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/feed'); // Redirect if not an admin
    }
  }, [role, navigate]);

  return (
    <div className="flex h-screen">
      <Sidebar onSelectOption={setSelectedOption} />
      <DashboardContent selectedOption={selectedOption} />
    </div>
  );
};

export default AdminDashboard;
