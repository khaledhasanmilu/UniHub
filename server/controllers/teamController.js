
const db = require("../config/db");


const getRequests = async (req, res) => {
  const uni = req.params.university;
  console.log(uni);
  const query = `SELECT users.name AS username ,users.user_id as id,requests.* FROM requests JOIN users ON requests.user_id = users.user_id WHERE users.university_id = ?;`;
  db.execute(query, [uni],(err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(result);
  });

};

const createRequest = (req, res) => {
  const{user_id, project_name, course_name, semester, description, end_time} = req.body;
  const query = `INSERT INTO requests (user_id,project_name, course_name, semester, description, end_time) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [user_id, project_name, course_name, semester, description, end_time];
  db.execute(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
   
    res.status(201).json(req.body);
  });
};
const updateRequest = async (req, res) => {
  const requestId = req.params.requestId;
  
  const { project_name, course_name, semester, description, end_time } = req.body;
  const query = `UPDATE requests SET project_name = ?, course_name = ?, semester = ?, description = ?, end_time = ? WHERE request_id = ?`;
  const values = [project_name, course_name, semester, description, end_time, requestId];
  db.execute(query, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
  
};
const deleteRequest = async (req, res) => {
  const requestId = req.params.requestId;
  const query = `DELETE FROM requests WHERE request_id = ?`;
  db.execute(query, [requestId], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(result);
  });
};
module.exports =  { getRequests, createRequest, updateRequest, deleteRequest };
