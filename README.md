# HR Management Portal

A modern Single Page Application (SPA) designed to manage employees and leave requests.

---

## Running the project
After cloning or downloading the repository, open the root project folder in IDE, then run the following commands:

### 1. Start the Backend API
1. Navigate to the `backend` folder in terminal:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (uses `nodemon`):
   ```bash
   npm start
   ```
   The backend server will run on `http://localhost:3000`.

### 2. Run the Frontend

**Option 1: VS Code Live Server**
1. Open the `/frontend` directory (or workspace root) in VSCode.
2. Right-click `index.html` and select "Open with Live Server".

**Option 2: Using CLI**
1. Navigate to the `frontend` folder in terminal:
   ```bash
   cd frontend
   ```
2. If you have Node.js installed, run the following commands inside the `frontend/` folder:
   ```bash
   npx serve .
   ```