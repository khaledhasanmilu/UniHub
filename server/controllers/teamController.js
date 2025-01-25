const { request } = require("express");
const db = require("../config/db");

const data = [
    { userId: 1, userName: 'Alice', projectName: 'AI Research', courseName: 'Artificial Intelligence', semester: 'Spring 2025', description: 'Looking for a team to work on an AI research project.', endTime: '2025-05-30' },
    { userId: 2, userName: 'Bob', projectName: 'Web Development', courseName: 'Web Programming', semester: 'Fall 2025', description: 'Need members for a web development project focused on building a modern web app.', endTime: '2025-06-15' },
    { userId: 4, userName: 'Charlie', projectName: 'Data Science', courseName: 'Data Science 101', semester: 'Winter 2025', description: 'Seeking group members for a data analysis project using Python.', endTime: '2025-04-01' }
];
const getRequests = async (req, res) => {
//   try {
//     const query = "SELECT * FROM requests";
//     const requests = await db.query(query);
//     res.status(200).json(requests);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
res.status(200).json(data);
};

const createRequest = async (req, res) => {
  console.log(req.body);
 res.status(201).json(req.body);
};
const updateRequest = async (req, res) => {
  console.log("update request");
  console.log(req.body);
  res.status(200).json(req.body);
};
const deleteRequest = async (req, res) => {
  res.status(204).json();
};
module.exports =  { getRequests, createRequest, updateRequest, deleteRequest };
