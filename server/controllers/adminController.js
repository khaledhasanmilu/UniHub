const db = require("../config/db");
const { get } = require("../routes/admin");

const getDashboard = (req, res) => {
  const query = `SELECT 
    
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE user_type = 'student') AS total_students,
    (SELECT COUNT(*) FROM users WHERE user_type = 'alumni') AS total_alumni,
    (SELECT COUNT(*) FROM users WHERE user_type = 'industry ') AS total_industry,                                                                                                    
    (SELECT COUNT(*) FROM posts) AS total_posts,
    (SELECT COUNT(*) FROM likes) AS total_likes,
    (SELECT COUNT(*) FROM comments) AS total_comments,
    (SELECT COUNT(*) FROM events) AS total_events,
    (SELECT COUNT(*) FROM events WHERE event_type = 'intra-university') AS intra_university_events,
    (SELECT COUNT(*) FROM events WHERE event_type = 'inter-university') AS inter_university_events,
    (SELECT COUNT(*) FROM jobs) AS total_jobs,
    (SELECT COUNT(*) FROM applications) AS total_applications,
    (SELECT COUNT(*) FROM notes) AS total_notes,
    (SELECT COUNT(*) FROM requests WHERE end_time > CURDATE()) AS active_requests
FROM DUAL;`;
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.json(result[0]);
    }
  });
};

const getTopUsers = (req, res) => {
  console.log("getTopUsers");
  const query = `SELECT u.user_id, 
       u.name, 
       COUNT(DISTINCT p.post_id) AS total_posts,
       COUNT(DISTINCT c.comment_id) AS total_comments,
       COUNT(DISTINCT l.like_id) AS total_likes,
       COUNT(DISTINCT m.message_id) AS total_messages_sent,
       COUNT(DISTINCT a.application_id) AS total_job_applications,
       (COUNT(DISTINCT p.post_id) + 
        COUNT(DISTINCT c.comment_id) + 
        COUNT(DISTINCT l.like_id) +
        COUNT(DISTINCT m.message_id) +
        COUNT(DISTINCT a.application_id)) AS engagement_score
FROM users u
LEFT JOIN posts p ON u.user_id = p.creator_id
LEFT JOIN comments c ON u.user_id = c.user_id
LEFT JOIN likes l ON u.user_id = l.user_id
LEFT JOIN messages m ON u.user_id = m.sender_id
LEFT JOIN applications a ON u.email = a.applicant_email
GROUP BY u.user_id
ORDER BY engagement_score DESC
LIMIT 10;`;
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.json(result);
    }
  });
};

const getTopPosts = (req, res) => {
  const query = `SELECT p.post_id, 
       u.name AS creator, 
       p.content, 
       COUNT(DISTINCT l.like_id) AS total_likes, 
       COUNT(DISTINCT c.comment_id) AS total_comments,
       (COUNT(DISTINCT l.like_id) + COUNT(DISTINCT c.comment_id)) AS engagement_score
FROM posts p
JOIN users u ON p.creator_id = u.user_id
LEFT JOIN likes l ON p.post_id = l.post_id
LEFT JOIN comments c ON p.post_id = c.post_id
GROUP BY p.post_id, u.name, p.content
ORDER BY engagement_score DESC
LIMIT 5;
`;
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.json(result);
    }
  });
};

const getTopCourses = (req, res) => {
  const query = `SELECT n.course_name, 
       COUNT(DISTINCT n.note_id) AS total_notes, 
       COUNT(DISTINCT p.post_id) AS total_discussions,
       COUNT(DISTINCT c.comment_id) AS total_comments
FROM notes n
LEFT JOIN posts p ON n.course_name = p.content
LEFT JOIN comments c ON p.post_id = c.post_id
GROUP BY n.course_name
ORDER BY COUNT(DISTINCT n.note_id) + COUNT(DISTINCT p.post_id) + COUNT(DISTINCT c.comment_id) DESC
LIMIT 5;`;
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.json(result);
    }
  });
};

const getTopJobs = (req, res) => {
    const query = `SELECT j.id AS job_id, 
       j.title, 
       j.company, 
       COUNT(a.application_id) AS total_applications
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, j.title, j.company
ORDER BY total_applications DESC
LIMIT 5;`;
    db.execute(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred" });
        } else {
            res.json(result);
        }
    });
};

const getMonthlyGrowth = (req, res) => {
  const query = `SELECT 
    DATE_FORMAT(u.created_at, '%Y-%m') AS month,
    COUNT(DISTINCT u.user_id) AS new_users,
    COUNT(DISTINCT p.post_id) AS new_posts,
    COUNT(DISTINCT c.comment_id) AS new_comments
FROM users u
LEFT JOIN posts p ON u.user_id = p.creator_id AND DATE_FORMAT(p.created_at, '%Y-%m') = DATE_FORMAT(u.created_at, '%Y-%m')
LEFT JOIN comments c ON u.user_id = c.user_id AND DATE_FORMAT(c.created_at, '%Y-%m') = DATE_FORMAT(u.created_at, '%Y-%m')
GROUP BY month
ORDER BY month DESC;`;
  db.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "An error occurred" });
    } else {
      res.json(result);
    }
  });
};

module.exports = {
  getDashboard,
  getTopUsers,
  getTopPosts,
  getTopCourses,
  getMonthlyGrowth,
  getTopJobs
};
