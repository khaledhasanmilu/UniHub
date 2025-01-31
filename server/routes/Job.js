const express = require('express');
const {uploadImage,uploadResume} = require('../config/multer');
const {createJob,getAllJobs,getMyJobs,deleteJob,getJob,applyJob,updateApplication
    ,getApplications,updateJob
} = require('../controllers/jobController');
const router = express.Router();



 router.post('/getAllJobs', getAllJobs);
 router.post('/getMyjobs', getMyJobs);
 router.post('/createJob', uploadImage.single('image') ,createJob);

router.put('/updateJob/:id', uploadImage.single('image'),updateJob);

router.delete('/deletejob/:id', deleteJob);
router.get('/getJob/:id', getJob);
router.post('/applyJob/:jobId',uploadResume.single('resume'), applyJob);

router.post('/getApplication', getApplications);
router.put('/updateApplicationStatus', updateApplication);
module.exports = router;