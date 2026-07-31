const express = require('express');
const { getLeaveRequests, createLeaveRequest, approveLeaveRequest } = require('../controllers/leaveController');

const router = express.Router();

router.get('/', getLeaveRequests);
router.post('/', createLeaveRequest);
router.patch('/:id/approve', approveLeaveRequest);

module.exports = router;
