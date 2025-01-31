const db = require('../config/db');


const getAlumni = (req, res) => {
   console.log(req.cookies);
   console.log(req.cookies);
    const query = (`SELECT 
    u.user_id,
    u.name,
    u.email,
    u.user_type,
    u.university_id,
    u.profile_picture,
    up.degree,
    up.graduation_year,
    up.skills,
    up.bio,
    up.twitter,
    up.linkedin,
    up.github
FROM 
    users u
JOIN 
    user_profiles up ON u.user_id = up.user_id
WHERE 
    u.university_id = (SELECT university_id FROM users WHERE user_id = ?) 
    AND up.degree = (SELECT degree FROM user_profiles WHERE user_id = ?)
    AND u.user_type = 'alumni';
`
    );

    db.query(query, [req.cookies.uid,req.cookies.uid], (err, data) => {
        if (err) {
            res.status(500).send('Failed to fetch alumni data');
            return;
        }
        res.json(data);
    });
};

const getUniversityAlumni = (req, res) => {
    console.log(req.cookies);
    const query = (`SELECT 
    u.user_id,
    u.name,
    u.email,
    u.user_type,
    u.university_id,
    u.profile_picture,
    up.degree,
    up.graduation_year,
    up.skills,
    up.bio,
    up.twitter,
    up.linkedin,
    up.github
FROM 
    users u
JOIN 
    user_profiles up ON u.user_id = up.user_id
WHERE 
    u.university_id = (SELECT university_id FROM users WHERE user_id = ?) 
    AND u.user_type = 'alumni';
`
    );

    db.query(query, [req.cookies.uid], (err, data) => {
        if (err) {
            res.status(500).send('Failed to fetch alumni data');
            return;
        }
        res.json(data);
    });
    };

module.exports = {getAlumni, getUniversityAlumni};
