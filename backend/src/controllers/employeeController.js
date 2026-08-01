const employeeStore = require('../models/employeeStore');
const leaveStore = require('../models/leaveStore');

// [GET] /employees/
const getEmployees = (req, res, next) => {
  try {
    const employees = employeeStore.getAllEmployees();
    res.status(200).json({ success: true, data: employees });
  } catch (error) {
    next(error);
  }
};

// [GET] /employees/:id
const getEmployeeById = (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = employeeStore.getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// [POST] /employees/
const createEmployee = (req, res, next) => {
  try {
    const { name, department, leaveBalance } = req.body;
    if (!name || !department) {
      return res.status(400).json({ success: false, error: 'Name and department are required' });
    }

    const newEmployee = employeeStore.addEmployee(req.body);
    res.status(201).json({ success: true, data: newEmployee });
  } catch (error) {
    next(error);
  }
};

// [DELETE] /employees/:id
const deleteEmployee = (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEmployee = employeeStore.deleteEmployee(id);
    const deletedLeavesCount = leaveStore.deleteLeavesByEmployeeId(id);

    if (!deletedEmployee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        message: 'Employee and related leave requests deleted successfully',
        deletedLeavesCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// [PUT] /employees/:id
const updateEmployee = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, department } = req.body;
    if (!name || !department) {
      return res.status(400).json({ success: false, error: 'Name and department are required' });
    }
    const updated = employeeStore.updateEmployee(id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
  updateEmployee
};
