import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import Massege from "./pages/Massege";
import PostsPage from "./pages/PostsPage";
import Structure from "./pages/Structure";
import Feed from "./pages/Feed";
import QuestionBank from "./pages/QuestionBank";
import GroupMate from "./pages/GroupMate";
import Event from "./pages/Event";
import UserProfile from "./pages/UserProfile";
import AlumniNet from "./pages/AlumniNet";
import Jobs from "./pages/Jobs";
import Application from "./pages/Application";
import ApplyJob from "./pages/ApplyJob";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Cookies from "js-cookie";
const App = () => {
  const role = Cookies.get("role");
  return (
    <Routes>
      <Route path="/login" element={<WelcomePage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      {/* Redirect "/" to "/feed" */}
      
      <Route path="/" element={<Navigate to="/feed" replace />} />
      <Route path="/" element={<Structure />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="messages" element={<Massege />} />
        <Route path="messages/:id" element={<Massege />} />
        <Route path="feed" element={<Feed />} />
        <Route path="questionBank" element={<QuestionBank />} />
        <Route path="findGroupmate" element={<GroupMate />} />
        <Route path="events" element={<Event />} />
        <Route path="user/:id" element={<UserProfile />} />
        <Route path="alumninet" element={<AlumniNet />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="applications" element={<Application />} />
        <Route path="jobapply/:jobId" element={<ApplyJob />} />
      </Route>

      {/* Global 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
