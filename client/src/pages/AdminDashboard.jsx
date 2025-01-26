import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from './../component/admin/Sidebar';


const DashboardContent = ({ selectedOption }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch data based on selected option
  const fetchData = async (endpoint) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(null);
    }
    setLoading(false);
  };

 

  return (
    <div className="flex-1 p-8">
      <div id="content" className="space-y-6">
        
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');

  return (
    <div className="flex">
      <Sidebar onSelectOption={setSelectedOption} />
      <DashboardContent selectedOption={selectedOption} />
    </div>
  );
};

export default AdminDashboard;
