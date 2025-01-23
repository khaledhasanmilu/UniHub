const express = require('express');
const router = express.Router();
const { getUserDetails, followUser } = require ('../controllers/userController');


router.get('/details/:id',getUserDetails );
router.post('/follow/:id',followUser );
module.exports = router;