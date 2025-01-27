import React, { useState, useEffect } from "react";

const PostsAndJobs = () => {
  const [postsData, setPostsData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [view, setView] = useState("posts"); // State to toggle between posts and jobs

  // Fetch data for posts
  useEffect(() => {
    const fetchPostsData = async () => {
      const response = await fetch('http://localhost:5000/api/admin/toppost'); // Replace with your API endpoint
      const result = await response.json();
      setPostsData(result);
    };
    fetchPostsData();

    // Fetch data for jobs
    const fetchJobsData = async () => {
      const response = await fetch('http://localhost:5000/api/admin/topjobs'); // Replace with your API endpoint
      const result = await response.json();
      setJobsData(result);
    };
    fetchJobsData();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Toggle Buttons for Posts and Jobs */}
        <div className="mb-4">
          <button
            onClick={() => setView("posts")}
            className={`px-4 py-2 ${view === "posts" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Top Posts
          </button>
          <button
            onClick={() => setView("jobs")}
            className={`px-4 py-2 ml-4 ${view === "jobs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Top Jobs
          </button>
        </div>

        {/* Conditional Rendering for Top Posts and Top Jobs */}
        {view === "posts" ? (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Top 5 Posts by Engagement</h2>
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Post Content</th>
                  <th className="px-4 py-2 text-left">Creator</th>
                  <th className="px-4 py-2 text-left">Total Likes</th>
                  <th className="px-4 py-2 text-left">Total Comments</th>
                  <th className="px-4 py-2 text-left">Engagement Score</th>
                </tr>
              </thead>
              <tbody>
                {postsData.map((post, index) => (
                  <tr key={post.post_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border px-4 py-2">{post.content}</td>
                    <td className="border px-4 py-2">{post.creator}</td>
                    <td className="border px-4 py-2">{post.total_likes}</td>
                    <td className="border px-4 py-2">{post.total_comments}</td>
                    <td className="border px-4 py-2">{post.engagement_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Top 5 Jobs by Applications</h2>
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Total Applications</th>
                </tr>
              </thead>
              <tbody>
                {jobsData.map((job, index) => (
                  <tr key={job.job_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border px-4 py-2">{job.title}</td>
                    <td className="border px-4 py-2">{job.company}</td>
                    <td className="border px-4 py-2">{job.total_applications}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsAndJobs;
