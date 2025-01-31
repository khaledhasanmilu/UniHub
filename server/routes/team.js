const express = require('express');
const router = express.Router();

const { getRequests, createRequest, updateRequest, deleteRequest } = require('../controllers/teamController');


router.get('/requests/:university', getRequests);
router.post('/requests', createRequest);
router.put('/requests/:requestId', updateRequest);
router.delete('/requests/:requestId', deleteRequest);


module.exports = router;