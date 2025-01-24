const db = require('../config/db');

const getUserDetails = (req,res)=>{
    const  userId = req.params.id;
    const currentUserId = req.query.currentUserId;
    console.log(userId,currentUserId);

    const query = `SELECT 
    u.user_id AS user_id,
    u.name AS name,
    u.profile_picture AS profilePicture,
    uni.name AS university,
    up.degree AS degree,
    up.graduation_year AS graduationYear,
    up.skills AS skills,
    up.bio AS bio,
    up.twitter AS twitter,
    up.linkedin AS linkedin,
    up.github AS github,
    (
        SELECT COUNT(*) FROM followers WHERE followed = u.user_id
    ) AS followers,
    (
        SELECT COUNT(*) FROM followers WHERE follower = u.user_id
    ) AS following,
    (
        SELECT EXISTS (
	SELECT 1 FROM followers WHERE follower = ? AND followed = u.user_id
        )
    ) AS isFollowing
FROM users u
LEFT JOIN universities uni ON u.university_id = uni.university_id
LEFT JOIN user_profiles up ON u.user_id = up.user_id
WHERE u.user_id = ?;`;
    db.execute(query,[currentUserId,userId],(err,result)=>{
        if(err){
            console.error("Error fetching user details:",err.message);
            return res.status(500).json({message:"Error fetching user details",error:err.message});
        }
        res.status(200).json(result[0]);
    });

    // res.send({
    //     name: 'John Doe',
    //     degree: 'BSc Computer Science',
    //     university: 'XYZ University',
    //     graduationYear: '2021',
    //     skills: 'JavaScript, React, Node.js, Express',
    //     bio: 'I am a software engineer with a passion for web development.',
    //     profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    //     twitter: 'https://twitter.com/johndoe',
    //     linkedin: 'https://linkedin.com/in/johndoe',
    //     github: 'https://github.com/johndoe',
    //     followers: 100,
    //     isFollowing: true

    // }).status(200);
}
const followUser = (req,res)=>{
    const followedId = req.params.id;
    console.log(followedId);
    const {userId,action} = req.body;
    if(action === 'follow'){
        const query = "INSERT INTO followers (follower,followed) VALUES (?,?)";
        db.execute(query,[userId,followedId],(err,result)=>{
            if(err){
                console.error("Error following user:",err.message);
                return res.status(500).json({message:"Error following user",error:err.message});
            }
            res.status(200).json({message:"User followed successfully"});
        });
    }
    else{
        const query = "DELETE FROM followers WHERE follower = ? AND followed = ?";
        db.execute(query,[userId,followedId],(err,result)=>{
            if(err){
                console.error("Error unfollowing user:",err.message);
                return res.status(500).json({message:"Error unfollowing user",error:err.message});
            }
            res.status(200).json({message:"User unfollowed successfully"});
        });
    }
}


const uploadProfilePicture = (req,res)=>{
    const userId = req.body.userId;
    const imageUrl = req.file
    ? `http://localhost:5000/uploads/images/${req.file.filename}`
    : null;

    console.log(userId,imageUrl);
    const query = "UPDATE users SET profile_picture = ? WHERE user_id = ?";
    db.execute(query,[imageUrl,userId],(err,result)=>{
        if(err){
            console.error("Error uploading profile picture:",err.message);
            return res.status(500).json({message:"Error uploading profile picture",error:err.message});
        }
        res.status(200).json({message:"Profile picture uploaded successfully"});
    });
}

const updateProfile = (req,res)=>{
    const {userId,degree,graduationYear,bio,twitter,linkedin,github,skills} = req.body;
    console.log(userId,degree,graduationYear,bio,twitter,linkedin,github,skills);
    const query = "INSERT INTO user_profiles (user_id,degree,graduation_year,bio,twitter,linkedin,github,skills) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE degree = VALUES(degree),graduation_year = VALUES(graduation_year),bio = VALUES(bio),twitter = VALUES(twitter),linkedin = VALUES(linkedin),github = VALUES(github),skills = VALUES(skills)";
    db.execute(query,[userId,degree,graduationYear,bio,twitter,linkedin,github,skills],(err,result)=>{
        if(err){
            console.error("Error updating profile:",err.message);
            return res.status(500).json({message:"Error updating profile",error:err.message});
        }
        res.status(200).json({message:"Profile updated successfully"});
    });
}
module.exports ={getUserDetails,followUser,uploadProfilePicture,updateProfile};