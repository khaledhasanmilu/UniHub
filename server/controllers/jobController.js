const db = require('../config/db');

exports.createJob = async (req, res) => {
  try {
    const { title, company, description, jobType, expectedSalary, applicationDeadline, requiredSkills, creator_id } = req.body;
    console.log(title, company, description, jobType, expectedSalary, applicationDeadline, requiredSkills, creator_id);

    const imageUrl = req.file
      ? `http://localhost:5000/uploads/images/${req.file.filename}`
      : null;
    console.log(imageUrl);

    const query = 'INSERT INTO jobs (title, company, description, job_type, expected_salary, application_deadline, required_skills, image_url, creator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

    db.execute(query, [title, company, description, jobType, expectedSalary, applicationDeadline, requiredSkills, imageUrl, creator_id], (err, result) => {
      if (err) {
        console.error("Error saving job to database:", err.message);
        return res
          .status(500)
          .json({ message: "Error saving job", error: err.message });
      }

      console.log("Job created with ID:", result.insertId);
      return res.status(201).json({
        message: "Job created successfully",
        jobId: result.insertId,
        title,
        company,
        description,
        jobType,
        expectedSalary,
        applicationDeadline,
        requiredSkills,
        imageUrl,
      });
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

exports.getAllJobs = async (req, res) => {
  try {
    const query = 'SELECT * FROM jobs;';
    db.execute(query, (err, results) => {
      if (err) {
        console.error("Error fetching jobs from database:", err.message);
        return res
          .status(500)
          .json({ message: "Error fetching jobs", error: err.message });
      }

      console.log("Fetched jobs:", results);
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

exports.getMyJobs = async (req, res) => {

  console.log(req.body);
  const { user_id } = req.body;
  console.log(user_id);
  try {
    const query = 'SELECT * FROM jobs WHERE creator_id = ?;';
    db.execute(query, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching jobs from database:", err.message);
        return res
          .status(500)
          .json({ message: "Error fetching jobs", error: err.message });
      }

      console.log("Fetched jobs:", results);
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
  });
}
}