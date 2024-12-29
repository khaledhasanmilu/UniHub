import React from 'react';
import SlidingLoginRegister from './component/LoginS'; // Import SlidingLoginRegister component

const WelcomePage = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      {/* Content Wrapper */}
      <div className='text-center px-4'>
        <h1 className="text-4xl font-bold mb-4">Welcome to UniHub</h1>
        <p className="text-lg mb-6">
          Connect with your university community, discover events, and much more.
        </p>
        <p className="text-xl mt-6 mb-6">Please log in or register to get started.</p>
      </div>

      {/* Include SlidingLoginRegister */}
      <SlidingLoginRegister />
    </div>
  );
};

export default WelcomePage;
