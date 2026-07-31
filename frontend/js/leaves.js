import { API } from './api.js';
import { showToast, getTodayString } from './utils.js';

export function leaves() {
    const leavesTableBody = document.querySelector('#leaves-table tbody');
    const btnShowAddLeave = document.getElementById('btn-show-add-leave');
    const btnCancelLeave = document.getElementById('btn-cancel-leave');
    const addLeaveFormContainer = document.getElementById('add-leave-form-container');
    const addLeaveForm = document.getElementById('add-leave-form');

    // Set min date for leave request to today
    const todayStr = getTodayString();
    document.getElementById('leave-start').min = todayStr;
    document.getElementById('leave-end').min = todayStr;

    async function loadLeaves() {
        try {
            const [leaves, employees] = await Promise.all([
                API.getLeaveRequests(),
                API.getEmployees()
            ]);

            const employeeMap = {};
            employees.forEach(emp => {
                employeeMap[emp.id] = emp.name;
            });

            renderLeaves(leaves, employeeMap);
        } catch (error) {
            showToast(error.message, 'error');
        }
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

    // Event Listener
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

    return { loadLeaves };
}
