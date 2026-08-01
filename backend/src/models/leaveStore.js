const initialData = require('./data.json');
const employeeStore = require('./employeeStore');
const {
    parseAndNormalizeDate,
    validateDateRange,
    calculateRequestedDays,
    isDateRangeOverlapping
} = require('../utils/dateUtils');

const leaveStore = {
    leaveRequests: [...initialData.leaveRequests],
    nextLeaveRequestId: initialData.leaveRequests.reduce((max, req) => Math.max(max, req.id), 0) + 1,

    getAllLeaveRequests() {
        return this.leaveRequests;
    },

    createLeaveRequest(leaveData) {
        const { employeeId, startDate, endDate, reason } = leaveData;
        const employee = employeeStore.getEmployeeById(employeeId);

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

        const start = parseAndNormalizeDate(startDate);
        const end = parseAndNormalizeDate(endDate);

        validateDateRange(start, end);

        this.checkOverlappingLeave(employeeId, start, end);

        const requestedDays = calculateRequestedDays(start, end);
        this.checkLeaveBalance(employee, requestedDays);

        employee.leaveBalance -= requestedDays;

        const newLeaveRequest = {
            id: this.nextLeaveRequestId++,
            employeeId,
            startDate,
            endDate,
            reason,
            requestedDays,
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
        if (leaveRequest.status !== 'pending') {
            const error = new Error(`Cannot approve a request that is already ${leaveRequest.status}.`);
            error.statusCode = 400;
            throw error;
        }

        leaveRequest.status = 'approved';
        return leaveRequest;
    },

    declineLeaveRequest(id) {
        const leaveRequest = this.leaveRequests.find((req) => String(req.id) === String(id));
        if (!leaveRequest) {
            const error = new Error('Leave request not found.');
            error.statusCode = 404;
            throw error;
        }
        if (leaveRequest.status !== 'pending') {
            const error = new Error(`Cannot decline a request that is already ${leaveRequest.status}.`);
            error.statusCode = 400;
            throw error;
        }
        if (leaveRequest.status === 'pending') {
            const employee = employeeStore.getEmployeeById(leaveRequest.employeeId);
            if (employee) {
                const daysToRefund = leaveRequest.requestedDays || 1;
                employee.leaveBalance += daysToRefund;
            }
        }
        leaveRequest.status = 'declined';
        return leaveRequest;
    },

    deleteLeavesByEmployeeId(employeeId) {
        const initialLength = this.leaveRequests.length;
        this.leaveRequests = this.leaveRequests.filter(
            (req) => String(req.employeeId) !== String(employeeId)
        );
        return initialLength - this.leaveRequests.length;
    },

    // Helper functions
    checkOverlappingLeave(employeeId, start, end) {
        const hasOverlap = this.leaveRequests.some((req) => {
            if (String(req.employeeId) === String(employeeId) && req.status !== 'declined') {
                const reqStart = parseAndNormalizeDate(req.startDate);
                const reqEnd = parseAndNormalizeDate(req.endDate);
                return isDateRangeOverlapping(start, end, reqStart, reqEnd);
            }
            return false;
        });

        if (hasOverlap) {
            const error = new Error('Leave request overlaps with an existing pending or approved request.');
            error.statusCode = 400;
            throw error;
        }
    },

    checkLeaveBalance(employee, requestedDays) {
        if (employee.leaveBalance < requestedDays) {
            const error = new Error(`Insufficient leave balance. Requested: ${requestedDays}, Available: ${employee.leaveBalance}`);
            error.statusCode = 400;
            throw error;
        }
    }

};

module.exports = leaveStore;
