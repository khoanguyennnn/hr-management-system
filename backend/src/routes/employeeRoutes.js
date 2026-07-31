const express = require('express');
const { getEmployees, getEmployeeById, createEmployee, deleteEmployee, updateEmployee } = require('../controllers/employeeController');

const router = express.Router();

router.get('/', getEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id', updateEmployee);

module.exports = router;
