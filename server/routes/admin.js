const express = require('express');
const router = express.Router();


const  {getDashboard}= require('../controllers/adminController');






router.get('/dashboard', getDashboard);
module.exports = router;