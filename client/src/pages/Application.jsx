import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApplicationCard from '../component/ApplicationCard';
import Cookies from 'js-cookie';

const Application = () => {
  const [applications, setApplications] = useState([]); // Ensure it's an array by default
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Get the userId from cookies
        const userId = Cookies.get('uid');
  
        if (!userId) {
          setError('User is not logged in');
          return;
        }
  
        // Make a POST request with userId
        const response = await axios.post('http://localhost:5000/api/job/getApplication', { userId });
  
        if (Array.isArray(response.data)) {
          // Filter out rejected applications before updating state
          const filteredApplications = response.data.filter(app => app.application_status !== 'Rejected');
          setApplications(filteredApplications);
        } else {
          throw new Error('The response is not an array');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to fetch applications.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchApplications();
  }, []);
  
  const handleStatusChange = (application_id, newStatus) => {
    console.log(`Updating status of application ${application_id} to ${newStatus}`);
  
    setApplications((prevApplications) => 
      newStatus === "Rejected"
        ? prevApplications.filter((app) => app.application_id !== application_id) // Remove immediately
        : prevApplications.map((app) => 
            app.application_id === application_id ? { ...app, application_status: newStatus } : app
          )
    );
  };
  
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
          <h1 className="text-2xl font-semibold mb-4 text-center">Job Applications</h1>
          
          {/* Check if there are any applications */}
          {applications.length > 0 ? (
            applications.map((application) => (
              <ApplicationCard
                key={application.application_id}
                application={application}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No job applications available.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Application;
