const express = require('express');
const { getLeaveRequests, createLeaveRequest, approveLeaveRequest, declineLeaveRequest } = require('../controllers/leaveController');

const router = express.Router();

router.get('/', getLeaveRequests);
router.post('/', createLeaveRequest);
router.patch('/:id/approve', approveLeaveRequest);
router.patch('/:id/decline', declineLeaveRequest);

module.exports = router;
