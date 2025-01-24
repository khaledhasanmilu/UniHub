const express = require('express');
const router = express.Router();
const { getAlumni, getUniversityAlumni } = require('../controllers/alumniController');

router.get("/getAlumni", getAlumni);
router.get("/getUniversityAlumni", getUniversityAlumni);


module.exports = router;