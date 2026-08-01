const initialData = require('./data.json');

const employeeStore = {
    employees: [...initialData.employees],
    nextEmployeeId: initialData.employees.reduce((max, emp) => Math.max(max, emp.id), 0) + 1,

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
        return this.employees.length < initialLength;
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
    }

};

module.exports = employeeStore;