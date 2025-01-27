const express = require('express');
const router = express.Router();


const  {getDashboard,getTopCourses,getMonthlyGrowth,getTopPosts,getTopUsers,getTopJobs}= require('../controllers/adminController');






router.get('/dashboard', getDashboard);
router.get('/topusers', getTopUsers);
router.get('/topcourse', getTopCourses);
router.get('/report', getMonthlyGrowth);
router.get('/toppost', getTopPosts);
router.get('/topjobs', getTopJobs);
module.exports = router;