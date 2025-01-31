import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const UserEngagement = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState("pie"); // State to toggle between "pie" and "table"

  // Fetch data from your API endpoint or database
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/admin/topusers'); // Replace with your API endpoint
      const result = await response.json();
      setData(result);
    };
    fetchData();
  }, []);

  // Pie Chart Data
  const pieData = {
    labels: data.map(user => user.name),
    datasets: [
      {
        data: data.map(user => user.engagement_score),
        backgroundColor: [
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(231, 233, 237, 0.7)",
          "rgba(54, 162, 35, 0.7)",
          "rgba(111, 235, 76, 0.7)",
          "rgba(206, 119, 111, 0.7)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "User Engagement Proportions",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const user = data[tooltipItem.dataIndex];
            return `${user.name}: ${user.engagement_score}`;
          },
        },
      },
    },
    maintainAspectRatio: false, // This will allow us to adjust the size freely
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Button to toggle view */}
        <div className="mb-4">
          <button
            onClick={() => setView("pie")}
            className={`px-4 py-2 ${view === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 ml-4 ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            User Data Table
          </button>
        </div>

        {/* Conditionally render the Pie Chart or Table */}
        {view === "pie" ? (
          <div style={{ width: "100%", height: "500px" }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Top 10 Users Engagement Data</h2>
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">User Name</th>
                  <th className="px-4 py-2 text-left">Total Posts</th>
                  <th className="px-4 py-2 text-left">Total Comments</th>
                  <th className="px-4 py-2 text-left">Total Likes</th>
                  <th className="px-4 py-2 text-left">Total Messages</th>
                  <th className="px-4 py-2 text-left">Total Applications</th>
                  <th className="px-4 py-2 text-left">Engagement Score</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user.user_id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.total_posts}</td>
                    <td className="border px-4 py-2">{user.total_comments}</td>
                    <td className="border px-4 py-2">{user.total_likes}</td>
                    <td className="border px-4 py-2">{user.total_messages_sent}</td>
                    <td className="border px-4 py-2">{user.total_job_applications}</td>
                    <td className="border px-4 py-2">{user.engagement_score}</td>
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

export default UserEngagement;
