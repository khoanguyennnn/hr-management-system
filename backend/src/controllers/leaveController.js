const store = require('../models/store');

const getLeaveRequests = (req, res, next) => {
  try {
    const leaves = store.getAllLeaveRequests();
    res.status(200).json({ success: true, data: leaves });
  } catch (error) {
    next(error);
  }
};

const createLeaveRequest = (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, reason } = req.body;
    
    if (!employeeId || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: 'employeeId, startDate, endDate, and reason are required' });
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (startDate < todayStr) {
      return res.status(400).json({ success: false, error: 'Start date cannot be in the past.' });
    }

    if (endDate < startDate) {
      return res.status(400).json({ success: false, error: 'End date must be greater than or equal to start date.' });
    }

    const newLeaveRequest = store.createLeaveRequest(req.body);
    res.status(201).json({ success: true, data: newLeaveRequest });
  } catch (error) {
    // We catch the error thrown from store (e.g. Employee not found or insufficient balance)
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    next(error);
  }
};

const approveLeaveRequest = (req, res, next) => {
  try {
    const { id } = req.params;
    const approvedLeave = store.approveLeaveRequest(id);
    res.status(200).json({ success: true, data: approvedLeave });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    next(error);
  }
};

module.exports = {
  getLeaveRequests,
  createLeaveRequest,
  approveLeaveRequest
};
