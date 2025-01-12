const express = require('express');
const { getUniversities } = require('../controllers/universityController');
const router = express.Router();

router.get('/list', getUniversities);

module.exports = router;
