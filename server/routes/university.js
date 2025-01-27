const express = require('express');
const { getUniversities,addUniversities } = require('../controllers/universityController');
const router = express.Router();

router.get('/list', getUniversities);
router.post('/list', addUniversities);
module.exports = router;
