// DashboardContent.js
import React from 'react';
import DetailsBar from './DashboardCharts';
import UserEngagement from './UserEngagement';
import PostsAndJobs from './PostAndJob';
import MonthlyUserEngagement from './MonthlyUserEngagememt';
import AddUniversity from './AddUniversity';

const DashboardContent = ({ selectedOption }) => {
  return (
    <div className="flex-1 p-2">
      <div id="content" className="max-w-6xl mx-auto">
        {selectedOption === 'dashboard' ? (
          <DetailsBar />
        ) : selectedOption === 'topusers' ? (
          <UserEngagement/>
        ) : selectedOption === 'post' ? (
          <PostsAndJobs />
        ):selectedOption === 'analytics' ? (
          <MonthlyUserEngagement/>
        ):selectedOption === 'university' ? (
          <AddUniversity/>
        ) : null
          }
      </div>
    </div>
  );
};

export default DashboardContent;
