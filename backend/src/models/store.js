// const initialData = require('./data.json');
// const { parseAndNormalizeDate, validateDateRange, calculateRequestedDays, isDateRangeOverlapping } = require('../utils/dateUtils');

// const store = {
//   employees: [...initialData.employees],
//   leaveRequests: [...initialData.leaveRequests],
//   nextEmployeeId: initialData.employees.reduce((max, emp) => Math.max(max, emp.id), 0) + 1,
//   nextLeaveRequestId: initialData.leaveRequests.reduce((max, req) => Math.max(max, req.id), 0) + 1,

//   // Employee methods
//   getAllEmployees() {
//     return this.employees;
//   },

//   getEmployeeById(id) {
//     return this.employees.find((emp) => String(emp.id) === String(id));
//   },

//   addEmployee(employeeData) {
//     const { name, department, leaveBalance } = employeeData;
//     const newEmployee = {
//       id: this.nextEmployeeId++,
//       name,
//       department,
//       leaveBalance: Number(leaveBalance) || 0,
//     };
//     this.employees.push(newEmployee);
//     return newEmployee;
//   },

//   deleteEmployee(id) {
//     const initialLength = this.employees.length;
//     this.employees = this.employees.filter((emp) => String(emp.id) !== String(id));
//     return this.employees.length < initialLength; // true if deleted
//   },

//   updateEmployee(id, employeeData) {
//     const employee = this.getEmployeeById(id);
//     if (!employee) {
//       const error = new Error('Employee not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     const { name, department, leaveBalance } = employeeData;
//     if (name !== undefined) employee.name = name;
//     if (department !== undefined) employee.department = department;
//     if (leaveBalance !== undefined) employee.leaveBalance = Number(leaveBalance);
//     return employee;
//   },

//   // Leave methods
//   getAllLeaveRequests() {
//     return this.leaveRequests;
//   },

//   createLeaveRequest(leaveData) {
//     const { employeeId, startDate, endDate, reason } = leaveData;
//     const employee = this.getEmployeeById(employeeId);

//     if (!employee) {
//       const error = new Error('Employee not found.');
//       error.statusCode = 404;
//       throw error;
//     }

//     if (employee.leaveBalance < 1) {
//       const error = new Error('Employee leave balance is insufficient.');
//       error.statusCode = 400;
//       throw error;
//     }

//     const start = parseAndNormalizeDate(startDate);
//     const end = parseAndNormalizeDate(endDate);

//     validateDateRange(start, end);

//     this.checkOverlappingLeave(employeeId, start, end);

//     const requestedDays = calculateRequestedDays(start, end);
//     this.checkLeaveBalance(employee, requestedDays);

//     employee.leaveBalance -= requestedDays;

//     const newLeaveRequest = {
//       id: this.nextLeaveRequestId++,
//       employeeId,
//       startDate,
//       endDate,
//       reason,
//       requestedDays,
//       status: 'pending'
//     };

//     this.leaveRequests.push(newLeaveRequest);
//     return newLeaveRequest;
//   },

//   approveLeaveRequest(id) {
//     const leaveRequest = this.leaveRequests.find((req) => String(req.id) === String(id));
//     if (!leaveRequest) {
//       const error = new Error('Leave request not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (leaveRequest.status !== 'pending') {
//       const error = new Error(`Cannot approve a request that is already ${leaveRequest.status}.`);
//       error.statusCode = 400;
//       throw error;
//     }

//     leaveRequest.status = 'approved';
//     return leaveRequest;
//   },

//   declineLeaveRequest(id) {
//     const leaveRequest = this.leaveRequests.find((req) => String(req.id) === String(id));
//     if (!leaveRequest) {
//       const error = new Error('Leave request not found.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (leaveRequest.status !== 'pending') {
//       const error = new Error(`Cannot decline a request that is already ${leaveRequest.status}.`);
//       error.statusCode = 400;
//       throw error;
//     }
//     if (leaveRequest.status === 'pending') {
//       const employee = this.getEmployeeById(leaveRequest.employeeId);
//       if (employee) {
//         const daysToRefund = leaveRequest.requestedDays || 1;
//         employee.leaveBalance += daysToRefund;
//       }
//     }
//     leaveRequest.status = 'declined';
//     return leaveRequest;
//   },

//   // Helper functions
//   checkOverlappingLeave(employeeId, start, end) {
//     const hasOverlap = this.leaveRequests.some((req) => {
//       if (String(req.employeeId) === String(employeeId) && req.status !== 'declined') {
//         const reqStart = parseAndNormalizeDate(req.startDate);
//         const reqEnd = parseAndNormalizeDate(req.endDate);
//         return isDateRangeOverlapping(start, end, reqStart, reqEnd);
//       }
//       return false;
//     });

//     if (hasOverlap) {
//       const error = new Error('Leave request overlaps with an existing pending or approved request.');
//       error.statusCode = 400;
//       throw error;
//     }
//   },

//   checkLeaveBalance(employee, requestedDays) {
//     if (employee.leaveBalance < requestedDays) {
//       const error = new Error(`Insufficient leave balance. Requested: ${requestedDays}, Available: ${employee.leaveBalance}`);
//       error.statusCode = 400;
//       throw error;
//     }
//   }

// };




// module.exports = store;
