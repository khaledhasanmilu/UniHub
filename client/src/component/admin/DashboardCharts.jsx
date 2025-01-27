import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCharts = () => {
  const [dashboardData, setDashboardData] = useState(null); // To store the fetched data
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [selectedChart, setSelectedChart] = useState('bar'); // State to track the selected chart

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data); // Store the data
      } catch (error) {
        setError(error.message); // Handle any errors
      } finally {
        setLoading(false); // Stop loading when the fetch is complete
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Chart Data
  const barData = {
    labels: [
      "Total Users",
      "Total Students",
      "Total Alumni",
      "Total Industry",
      "Total Posts",
      "Total Likes",
      "Total Comments",
    ],
    datasets: [
      {
        label: "Counts",
        data: [
          dashboardData.total_users,
          dashboardData.total_students,
          dashboardData.total_alumni,
          dashboardData.total_industry,
          dashboardData.total_posts,
          dashboardData.total_likes,
          dashboardData.total_comments,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Comparing Total Counts",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const stackedBarData = {
    labels: ["Intra-University Events", "Inter-University Events"],
    datasets: [
      {
        label: "Intra-University",
        data: [dashboardData.intra_university_events, 0],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Inter-University",
        data: [0, dashboardData.inter_university_events],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Event Distribution",
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const pieData = {
    labels: ["Students", "Alumni", "Industry"],
    datasets: [
      {
        data: [
          dashboardData.total_students,
          dashboardData.total_alumni,
          dashboardData.total_industry,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 1)", 
          "rgba(153, 102, 255, 1)", 
          "rgba(255, 159, 64, 1)"
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
        text: "User Activity Proportions",
      },
    },
    maintainAspectRatio: false, // This will allow us to adjust the size freely
  };

  // Handle chart selection
  const handleChartSelect = (event) => {
    setSelectedChart(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl bg-white shadow-md rounded-md p-8">
        {/* Dropdown for selecting chart */}
        <div className="mb-6">
          <select
            value={selectedChart}
            onChange={handleChartSelect}
            className="bg-gray-200 p-2 rounded-md"
          >
            <option value="bar">Bar Chart</option>
            <option value="stackedBar">Stacked Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        {/* Render selected chart */}
        <div className="flex justify-center">
          {selectedChart === 'bar' && <Bar data={barData} options={barOptions} />}
          {selectedChart === 'stackedBar' && <Bar data={stackedBarData} options={stackedBarOptions} />}
          {selectedChart === 'pie' && (
            <div style={{ width: '50%', height: '500px' }}> {/* Adjust the width and height here */}
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
