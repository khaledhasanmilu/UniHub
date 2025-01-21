const express = require('express');
const upload = require('../config/multer');
const {createJob,getAllJobs,getMyJobs} = require('../controllers/jobController');
const router = express.Router();



 router.post('/getAllJobs', getAllJobs);
 router.post('/getMyjobs', getMyJobs);
 router.post('/createJob', upload.single('image') ,createJob);
// router.put('/:id', updateJob);
// router.delete('/:id', deleteJob);

module.exports = router;