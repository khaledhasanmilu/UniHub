import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyUserEngagement = () => {
  const [engagementData, setEngagementData] = useState([]);
  const [view, setView] = useState("table"); // 'table' or 'chart'

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/api/admin/report'); // Replace with your API endpoint
      const result = await response.json();
      setEngagementData(result);
    };
    fetchData();
  }, []);

  // Prepare data for the histogram (Bar Chart)
  const barData = {
    labels: engagementData.map((data) => data.month),
    datasets: [
      {
        label: "New Users",
        data: engagementData.map((data) => data.new_users),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "New Posts",
        data: engagementData.map((data) => data.new_posts),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "New Comments",
        data: engagementData.map((data) => data.new_comments),
        backgroundColor: "rgba(255, 159, 64, 0.7)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly User Engagement",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Monthly User Engagement Data</h2>
        
        {/* View Toggle Button */}
        <div className="mb-4">
          <button
            onClick={() => setView("table")}
            className={`mr-4 py-2 px-4 ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Table View
          </button>
          <button
            onClick={() => setView("chart")}
            className={`py-2 px-4 ${view === "chart" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Histogram View
          </button>
        </div>

        {/* Conditional Rendering */}
        {view === "table" ? (
          <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-left">New Users</th>
                <th className="px-4 py-2 text-left">New Posts</th>
                <th className="px-4 py-2 text-left">New Comments</th>
              </tr>
            </thead>
            <tbody>
              {engagementData.map((data, index) => (
                <tr key={data.month} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                  <td className="border px-4 py-2">{data.month}</td>
                  <td className="border px-4 py-2">{data.new_users}</td>
                  <td className="border px-4 py-2">{data.new_posts}</td>
                  <td className="border px-4 py-2">{data.new_comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ width: "100%", height: "500px" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyUserEngagement;
