document.addEventListener('DOMContentLoaded', () => {
    // Views
    const viewHome = document.getElementById('view-home');
    const viewEmployees = document.getElementById('view-employees');
    const viewLeaves = document.getElementById('view-leaves');

    // Navigation Buttons
    const btnGoEmployees = document.getElementById('btn-go-employees');
    const btnGoLeaves = document.getElementById('btn-go-leaves');
    const btnNavLeaves = document.getElementById('btn-nav-leaves');
    const btnNavEmployees = document.getElementById('btn-nav-employees');
    const btnNavHomes = document.querySelectorAll('#btn-nav-home');

    // DOM Elements - Employees
    const employeesTableBody = document.querySelector('#employees-table tbody');
    const btnShowAddEmployee = document.getElementById('btn-show-add-employee');
    const btnCancelEmployee = document.getElementById('btn-cancel-employee');
    const addEmployeeFormContainer = document.getElementById('add-employee-form-container');
    const addEmployeeForm = document.getElementById('add-employee-form');

    // DOM Elements - Leaves
    const leavesTableBody = document.querySelector('#leaves-table tbody');
    const btnShowAddLeave = document.getElementById('btn-show-add-leave');
    const btnCancelLeave = document.getElementById('btn-cancel-leave');
    const addLeaveFormContainer = document.getElementById('add-leave-form-container');
    const addLeaveForm = document.getElementById('add-leave-form');

    const toast = document.getElementById('toast');

    // Set min date for leave request to today
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('leave-start').min = todayStr;
    document.getElementById('leave-end').min = todayStr;

    // --- Navigation Logic ---
    function hideAllViews() {
        viewHome.classList.add('hidden');
        viewEmployees.classList.add('hidden');
        viewLeaves.classList.add('hidden');
    }

    function showView(viewId) {
        hideAllViews();
        document.getElementById(viewId).classList.remove('hidden');
    }

    btnGoEmployees.addEventListener('click', () => {
        showView('view-employees');
        loadEmployees();
    });

    btnGoLeaves.addEventListener('click', () => {
        showView('view-leaves');
        loadLeaves();
    });

    btnNavLeaves.addEventListener('click', () => {
        showView('view-leaves');
        loadLeaves();
    });

    btnNavEmployees.addEventListener('click', () => {
        showView('view-employees');
        loadEmployees();
    });

    btnNavHomes.forEach(btn => {
        btn.addEventListener('click', () => {
            showView('view-home');
        });
    });

    // --- Utility ---
    function showToast(message, type = 'success') {
        toast.textContent = message;
        toast.className = `toast ${type}`;
        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3000);
    }

    // --- Data Loading ---
    async function loadEmployees() {
        try {
            const employees = await API.getEmployees();
            renderEmployees(employees);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    async function loadLeaves() {
        try {
            // Need both leaves and employees to map employeeId to employee name
            const [leaves, employees] = await Promise.all([
                API.getLeaveRequests(),
                API.getEmployees()
            ]);

            // Create a map of employeeId -> employeeName for O(1) lookup
            const employeeMap = {};
            employees.forEach(emp => {
                employeeMap[emp.id] = emp.name;
            });

            renderLeaves(leaves, employeeMap);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // --- Rendering ---
    function renderEmployees(employees) {
        employeesTableBody.innerHTML = '';
        employees.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span title="${emp.id}">${emp.id}</span></td>
                <td>${emp.name}</td>
                <td>${emp.department}</td>
                <td>${emp.leaveBalance}</td>
                <td>
                    <button class="btn btn-danger btn-delete-emp" data-id="${emp.id}">Delete</button>
                </td>
            `;
            employeesTableBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-delete-emp').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    await API.deleteEmployee(id);
                    showToast('Employee deleted successfully');
                    loadEmployees();
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        });
    }

    function renderLeaves(leaves, employeeMap) {
        leavesTableBody.innerHTML = '';
        leaves.forEach(leave => {
            const tr = document.createElement('tr');
            const empName = employeeMap[leave.employeeId] || 'Unknown';
            tr.innerHTML = `
                <td><span title="${leave.employeeId}">${leave.employeeId}</span></td>
                <td>${empName}</td>
                <td>${leave.startDate}</td>
                <td>${leave.endDate}</td>
                <td>${leave.reason}</td>
                <td><span class="status-badge status-${leave.status}">${leave.status}</span></td>
                <td>
                    ${leave.status === 'pending' ? `<button class="btn btn-success btn-approve-leave" data-id="${leave.id}">Approve</button>` : ''}
                </td>
            `;
            leavesTableBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-approve-leave').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                try {
                    await API.approveLeaveRequest(id);
                    showToast('Leave approved successfully');
                    loadLeaves();
                } catch (error) {
                    showToast(error.message, 'error');
                }
            });
        });
    }

    // --- Form Handling ---
    btnShowAddEmployee.addEventListener('click', () => {
        addEmployeeFormContainer.classList.remove('hidden');
    });

    btnCancelEmployee.addEventListener('click', () => {
        addEmployeeFormContainer.classList.add('hidden');
        addEmployeeForm.reset();
    });

    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('emp-name').value;
        const department = document.getElementById('emp-dept').value;
        const leaveBalance = document.getElementById('emp-leave').value;

        try {
            await API.addEmployee({ name, department, leaveBalance: Number(leaveBalance) });
            showToast('Employee added successfully');
            addEmployeeForm.reset();
            addEmployeeFormContainer.classList.add('hidden');
            loadEmployees();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    btnShowAddLeave.addEventListener('click', () => {
        addLeaveFormContainer.classList.remove('hidden');
    });

    btnCancelLeave.addEventListener('click', () => {
        addLeaveFormContainer.classList.add('hidden');
        addLeaveForm.reset();
    });

    addLeaveForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const employeeId = document.getElementById('leave-emp').value;
        const startDate = document.getElementById('leave-start').value;
        const endDate = document.getElementById('leave-end').value;
        const reason = document.getElementById('leave-reason').value;

        // Frontend validation
        const todayVal = new Date();
        const todayValStr = `${todayVal.getFullYear()}-${String(todayVal.getMonth() + 1).padStart(2, '0')}-${String(todayVal.getDate()).padStart(2, '0')}`;

        if (startDate < todayValStr) {
            showToast('Start date cannot be in the past.', 'error');
            return;
        }

        if (endDate < startDate) {
            showToast('End date must be greater than or equal to start date.', 'error');
            return;
        }

        try {
            await API.addLeaveRequest({
                employeeId: Number(employeeId),
                startDate,
                endDate,
                reason
            });
            showToast('Leave requested successfully');
            addLeaveForm.reset();
            addLeaveFormContainer.classList.add('hidden');
            loadLeaves();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});
