import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './Welcome';
import SlidingLoginRegister from './component/LoginS';
import Dashboard from './Dashboard'; // Example dashboard component

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<SlidingLoginRegister />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
