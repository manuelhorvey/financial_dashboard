const express = require('express');
const Employee = require('../models/employee');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, address, phone, role, salary, status } = req.body;

  // Validate request body
  if (!name || !address || !phone || !role || !salary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newEmployee = new Employee({ name, address, phone, role, salary, status });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error('Error creating employee:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id',async(req, res)=>{
  const {id} = req.params;
  const updates = req.body;
  try {
    const updateEmployee = await Employee.findByIdAndUpdate(id, updates, {new:true});
    if(!updateEmployee){
      return res.status(404).json({message: "Employee not found"});
    }
    res.json(updateEmployee)
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
})

module.exports = router;