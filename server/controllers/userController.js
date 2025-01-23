const db = require('../config/db');

const getUserDetails = (req,res)=>{
    const userId = req.params.id;
    console.log(userId);
    res.send({
        name: 'John Doe',
        degree: 'BSc Computer Science',
        university: 'XYZ University',
        graduationYear: '2021',
        bio: 'I am a software engineer with a passion for web development.',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        twitter: 'https://twitter.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe'
    }).status(200);
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

module.exports ={getUserDetails,followUser}