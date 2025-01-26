
const db = require('../config/db');


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
FROM DUAL;`
    db.execute(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({ message: "An error occurred" });
        } else {
            res.json(result[0]);
        }
    });
};





module.exports = {  getDashboard };