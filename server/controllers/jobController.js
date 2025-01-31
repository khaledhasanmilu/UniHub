const e = require('express');
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

exports.deleteJob = async (req, res) => {

  const { id } = req.params;
  console.log(id);
  try {
    const query = 'DELETE FROM jobs WHERE id = ?;';
    db.execute(query, [id], (err, results) => {
      if (err) {
        console.error("Error deleting job from database:", err.message);
        return res
          .status(500)
          .json({ message: "Error deleting job", error: err.message });
      }

      console.log("Deleted job with ID:", id);
      return res.status(200).json({ message: "Job deleted successfully" });
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

exports.getJob = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM jobs WHERE id = ?;';
    db.execute(query, [id], (err, results) => {
      if (err) {
        console.error("Error fetching job from database:", err.message);
        return res
          .status(500)
          .json({ message: "Error fetching job", error: err.message });
      }

      console.log("Fetched job:", results);
      return res.status(200).json(results[0]);
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

// applyJob function to handle the job application
exports.applyJob = async (req, res) => {
  const { name, email, coverLetter } = req.body;
  const { jobId } = req.params;

  try {

    // Check if Multer has passed any validation errors
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    console.log(req.fileValidationError);

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required!" });
    }

    
    

    const resumeUrl = `http://localhost:5000/uploads/resumes/${req.file.filename}`;

    const query = 'INSERT INTO applications (job_id, applicant_name, applicant_email, resume_url, cover_letter,application_status) VALUES (?, ?, ?, ?, ?,?)';
    db.execute(query, [jobId, name, email, resumeUrl, coverLetter,"Pending"], (err, result) => {
      if (err) {
        console.error("Error saving application to database:", err.message);
        return res.status(500).json({ message: "Error saving application", error: err.message });
      }

      console.log("Application created with ID:", result.insertId);
      return res.status(201).json({
        message: "Application submitted successfully",
        applicationId: result.insertId,
        name,
        email,
        resumeUrl,
        coverLetter,
      });
    });
  } catch (error) {
    console.error('Error applying job:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateApplication = async (req, res) => {
  const { application_id, status } = req.body;
  console.log(application_id, status);
  try {
    const query = 'UPDATE applications SET application_status = ? WHERE application_id = ?;';
    db.execute(query, [status, application_id], (err, result) => {
      if (err) {
        console.error("Error updating application status in database:", err.message);
        return res.status(500).json({ message: "Error updating application status", error: err.message });
      }

      console.log("Updated application status with ID:", application_id);
      return res.status(200).json({ message: "Application status updated successfully" });
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getApplications = async (req, res) => {
  const { userId } = req.body;
  try {
    const query = `
  SELECT applications.*, jobs.title AS job_title 
  FROM applications 
  JOIN jobs ON applications.job_id = jobs.id 
  WHERE jobs.creator_id = ? AND applications.application_status <> 'Rejected';
`;

    db.execute(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching applications from database:", err.message);
        return res.status(500).json({ message: "Error fetching applications", error: err.message });
      }

      console.log("Fetched applications:", results);
      return res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company, description, job_type, expected_salary, application_deadline, required_skills } = req.body;
  
  // If the image is uploaded, use the file's URL
  let imageUrl = req.body.image_url;
  if (req.file) {
    imageUrl = `http://localhost:5000/uploads/images/${req.file.filename}`; // Return the URL of the uploaded image
  }

  try {
    const query = 'UPDATE jobs SET title = ?, company = ?, description = ?, job_type = ?, expected_salary = ?, application_deadline = ?, required_skills = ?, image_url = ? WHERE id = ?;';
    db.execute(query, [title, company, description, job_type, expected_salary, application_deadline, required_skills, imageUrl, id], (err, result) => {
      if (err) {
        console.error("Error updating job in database:", err.message);
        return res.status(500).json({ message: "Error updating job", error: err.message });
      }

      console.log("Updated job with ID:", id);
      return res.status(200).json({ message: "Job updated successfully" });
    });
  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}