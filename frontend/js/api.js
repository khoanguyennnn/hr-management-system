const API_BASE_URL = 'http://localhost:3000';

export class API {
    static async request(endpoint, method = 'GET', body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            return data.data;
        } catch (error) {
            throw error;
        }
    }

    static getEmployees() {
        return this.request('/employees');
    }

    static addEmployee(employee) {
        return this.request('/employees', 'POST', employee);
    }

    static deleteEmployee(id) {
        return this.request(`/employees/${id}`, 'DELETE');
    }

    static updateEmployee(id, employee) {
        return this.request(`/employees/${id}`, 'PUT', employee);
    }

    static getLeaveRequests() {
        return this.request('/leave');
    }

    static addLeaveRequest(leave) {
        return this.request('/leave', 'POST', leave);
    }

    static approveLeaveRequest(id) {
        return this.request(`/leave/${id}/approve`, 'PATCH');
    }

    static declineLeaveRequest(id) {
        return this.request(`/leave/${id}/decline`, 'PATCH');
    }
}
