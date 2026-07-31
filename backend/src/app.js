const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/employees', employeeRoutes);
app.use('/leave', leaveRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
