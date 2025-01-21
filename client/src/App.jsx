import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/Welcome';
import SlidingLoginRegister from './component/LoginS';
import Dashboard from './pages/Dashboard'; // Example dashboard component
import ProfilePage from './pages/ProfilePage';
import Massege from './pages/Massege';
import PostsPage from './pages/PostsPage';
import Structure from './pages/Structure';
import Feed from './pages/Feed';
import QuestionBank from './pages/QuestionBank';
import GroupMate from './pages/GroupMate';
import Event from './pages/Event';
import Research from './pages/Research';
import UserProfile from './pages/UserProfile';
import AlumniNet from './pages/AlumniNet';
import Jobs from './pages/Jobs';
import Application from './pages/Application';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<WelcomePage />} />     
      <Route path="/" element={<Structure />}>

        {/* Nested routes rendered inside <Outlet> */}
        <Route index element={<PostsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="messages" element={<Massege />} />
        <Route path="feed" element={<Feed/>} />
        <Route path="questionBank" element={<QuestionBank />} />
        <Route path="findGroupmate" element={<GroupMate />} />
        <Route path="events" element={<Event/>} />
        <Route path="research" element={<Research/>} />
         <Route path="user/:id" element={<UserProfile/>} /> 
         <Route path='alumninet' element={<AlumniNet/>}/>
         <Route path='jobs' element={<Jobs/>}/>
         <Route path='applications' element={<Application/>}/>
      </Route>
     
    </Routes>
  );
};

export default App;
