const initialData = require('./data.json');

const store = {
  employees: [...initialData.employees],
  leaveRequests: [...initialData.leaveRequests],
  nextEmployeeId: initialData.employees.reduce((max, emp) => Math.max(max, emp.id), 0) + 1,
  nextLeaveRequestId: initialData.leaveRequests.reduce((max, req) => Math.max(max, req.id), 0) + 1,

  // Employee methods
  getAllEmployees() {
    return this.employees;
  },

  getEmployeeById(id) {
    return this.employees.find((emp) => String(emp.id) === String(id));
  },

  addEmployee(employeeData) {
    const { name, department, leaveBalance } = employeeData;
    const newEmployee = {
      id: this.nextEmployeeId++,
      name,
      department,
      leaveBalance: Number(leaveBalance) || 0,
    };
    this.employees.push(newEmployee);
    return newEmployee;
  },

  deleteEmployee(id) {
    const initialLength = this.employees.length;
    this.employees = this.employees.filter((emp) => String(emp.id) !== String(id));
    return this.employees.length < initialLength; // true if deleted
  },

  updateEmployee(id, employeeData) {
    const employee = this.getEmployeeById(id);
    if (!employee) {
      const error = new Error('Employee not found.');
      error.statusCode = 404;
      throw error;
    }
    const { name, department, leaveBalance } = employeeData;
    if (name !== undefined) employee.name = name;
    if (department !== undefined) employee.department = department;
    if (leaveBalance !== undefined) employee.leaveBalance = Number(leaveBalance);
    return employee;
  },

  // Leave methods
  getAllLeaveRequests() {
    return this.leaveRequests;
  },

  createLeaveRequest(leaveData) {
    const { employeeId, startDate, endDate, reason } = leaveData;
    const employee = this.getEmployeeById(employeeId);

    if (!employee) {
      const error = new Error('Employee not found.');
      error.statusCode = 404;
      throw error;
    }

    if (employee.leaveBalance < 1) {
      const error = new Error('Employee leave balance is insufficient.');
      error.statusCode = 400;
      throw error;
    }

    // "Transaction" in memory
    employee.leaveBalance -= 1;

    const newLeaveRequest = {
      id: this.nextLeaveRequestId++,
      employeeId,
      startDate,
      endDate,
      reason,
      status: 'pending'
    };

    this.leaveRequests.push(newLeaveRequest);
    return newLeaveRequest;
  },

  approveLeaveRequest(id) {
    const leaveRequest = this.leaveRequests.find((req) => String(req.id) === String(id));
    if (!leaveRequest) {
      const error = new Error('Leave request not found.');
      error.statusCode = 404;
      throw error;
    }
    leaveRequest.status = 'approved';
    return leaveRequest;
  }
};

module.exports = store;
