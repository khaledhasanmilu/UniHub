const express = require('express');
const router = express.Router();
const { getUserDetails, followUser, uploadProfilePicture,updateProfile} = require ('../controllers/userController');
const {uploadImage} = require('../config/multer');

router.get('/details/:id',getUserDetails );
router.post('/follow/:id',followUser );
router.post('/upload-picture',uploadImage.single('profilePicture'),uploadProfilePicture );
router.post('/updateProfile',updateProfile );
module.exports = router;