import { API } from './api.js';
import { showToast } from './utils.js';

export function employees() {
    const employeesTableBody = document.querySelector('#employees-table tbody');
    const btnShowAddEmployee = document.getElementById('btn-show-add-employee');
    const btnCancelEmployee = document.getElementById('btn-cancel-employee');
    const addEmployeeFormContainer = document.getElementById('add-employee-form-container');
    const addEmployeeForm = document.getElementById('add-employee-form');
    const employeeFormTitle = document.getElementById('employee-form-title');
    const btnSubmitEmployee = addEmployeeForm.querySelector('button[type="submit"]');

    let editingEmployeeId = null;

    async function loadEmployees() {
        try {
            const employees = await API.getEmployees();
            renderEmployees(employees);
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

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
                    <button 
                        class="btn btn-edit btn-edit-emp btn-action" 
                        data-id="${emp.id}" 
                        data-name="${emp.name}" 
                        data-dept="${emp.department}" 
                        data-leave="${emp.leaveBalance}"
                    >
                        Edit
                    </button>
                    <button 
                        class="btn btn-danger btn-delete-emp btn-action" 
                        data-id="${emp.id}"
                    >
                        Delete
                    </button>
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

        document.querySelectorAll('.btn-edit-emp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const { id, name, dept, leave } = e.target.dataset;
                editingEmployeeId = id;
                document.getElementById('emp-name').value = name;
                document.getElementById('emp-dept').value = dept;
                document.getElementById('emp-leave').value = leave;

                employeeFormTitle.textContent = 'Edit Employee';
                btnSubmitEmployee.textContent = 'Update';
                addEmployeeFormContainer.classList.remove('hidden');
            });
        });
    }

    // Event Listener
    btnShowAddEmployee.addEventListener('click', () => {
        editingEmployeeId = null;
        addEmployeeForm.reset();
        employeeFormTitle.textContent = 'Add New Employee';
        btnSubmitEmployee.textContent = 'Save';
        addEmployeeFormContainer.classList.toggle('hidden');
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
            if (editingEmployeeId) {
                await API.updateEmployee(editingEmployeeId, { name, department, leaveBalance: Number(leaveBalance) });
                showToast('Employee updated successfully');
            } else {
                await API.addEmployee({ name, department, leaveBalance: Number(leaveBalance) });
                showToast('Employee added successfully');
            }
            addEmployeeForm.reset();
            addEmployeeFormContainer.classList.add('hidden');
            editingEmployeeId = null;
            loadEmployees();
        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    return { loadEmployees };
}
