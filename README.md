# HR Management Portal

A modern Single Page Application (SPA) designed to manage employees and leave requests. The project implements a clean separation of concerns on both the backend and frontend.

---

## Getting Started

### 1. Start the Backend API
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (uses `nodemon`):
   ```bash
   npm run dev
   ```
   The backend server will run on `http://localhost:3000`.

### 2. Run the Frontend
> **Note:** Because the application uses ES6 Modules and dynamic view rendering, it must be served over HTTP/HTTPS rather than opening via `file://` protocol directly.

**Option 1: VS Code Live Server (Recommended)**
1. Open the `/frontend` directory (or workspace root) in **VS Code**.
2. Right-click `index.html` and select **Open with Live Server**.

**Option 2: Using Node.js CLI (Quickest without VS Code)**
If you have Node.js installed, run one of the following commands inside the `frontend/` folder:
   ```bash
   # From the frontend directory, e.g.:
   npx serve .
   ```

---

## Project Structure

```text
hr-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── employeeController.js  # Handle request validation & responses for Employees
│   │   │   └── leaveController.js     # Handle request validation & responses for Leave Requests
│   │   ├── models/
│   │   │   ├── data.json              # In-memory initial mock database
│   │   │   └── store.js               # In-memory database logic (isolated CRUD)
│   │   ├── routes/
│   │   │   ├── employeeRoutes.js      # Endpoint mapping for /employees
│   │   │   └── leaveRoutes.js         # Endpoint mapping for /leave
│   │   ├── middlewares/
│   │   │   └── errorHandler.js        # Global error and HTTP status code handler
│   │   └── app.js                     # Express app configuration
│   ├── package.json
│   └── server.js                      # Backend starting entry point (port listener)
├── frontend/
│   ├── css/
│   │   └── styles.css                 # Clean, responsive CSS with Glassmorphism and animations
│   ├── js/
│   │   ├── api.js                     # API fetch utility wrapper
│   │   ├── utils.js                   # UI utilities (toasts, dates)
│   │   ├── navigation.js              # SPA router fetching and mounting dynamic views
│   │   ├── employees.js               # Handler for Employees view logic (CRUD)
│   │   ├── leaves.js                  # Handler for Leave Requests view logic
│   │   └── app.js                     # Application entry point
│   ├── views/
│   │   ├── home.html                  # HTML template for Home view
│   │   ├── employees.html             # HTML template for Employees view
│   │   └── leaves.html                # HTML template for Leave Requests view
│   └── index.html                     # HTML root skeleton
└── README.md
```

---

## Backend Features (Node.js + Express)

- **Separation of Concerns**: Routes only handle routing, controllers handle HTTP input validation and responses, and the database logic is isolated in `store.js` using in-memory arrays.
- **Dynamic Initial Data**: Mock data is read directly from `data.json` at startup. IDs are sequential integers automatically tracking the maximum existing index.
- **Centralized Error Handling**: Any exception thrown in the business logic is caught globally and translated into standardized JSON error responses.
- **API Response Standardization**:
  - **Success (200/201)**: `{ "success": true, "data": { ... } }`
  - **Error (400/404/500)**: `{ "success": false, "error": "Error details" }`

### Endpoints
- **Employees**:
  - `GET /employees` → Fetch all employees.
  - `GET /employees/:id` → Fetch a single employee by ID.
  - `POST /employees` → Create a new employee (name, department, leaveBalance).
  - `PUT /employees/:id` → Edit employee details (name, department, leaveBalance).
  - `DELETE /employees/:id` → Delete an employee by ID.
- **Leave Requests**:
  - `GET /leave` → Fetch all leave requests.
  - `POST /leave` → Request a leave (employeeId, startDate, endDate, reason). Reduces the employee's `leaveBalance` by 1.
  - `PATCH /leave/:id/approve` → Approve a leave request (changes status to `approved`).

---

## Frontend Features (SPA Vanilla JS + HTML/CSS)

- **Pure SPA with Dynamic Template Loading**: The root `index.html` is an empty skeleton. Views (`home`, `employees`, `leaves`) are fetched dynamically via JavaScript and injected into the DOM on-the-fly.
- **Clean and Premium UI**: Features custom radial gradients, glassmorphic cards, smooth fades, and interactive `btn-animated` micro-animations for hover and active click states.
- **Smart Date Validation**:
  - Validations run on both client-side and server-side.
  - `startDate` and `endDate` cannot be in the past (disabled in the calendar UI and validated on submit).
  - `endDate` must be greater than or equal to `startDate`.
- **Integrated Views**: The Leaves view dynamically resolves and displays the employee's **Name** alongside their ID.