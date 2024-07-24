'use client'
import React, { useState } from 'react';
import styles from './addemployee.module.css';
import { Button, Paper, Input, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Employee {
  name: string;
  address: string;
  phone: string;
  role: string;
  salary: number;
  status: string;
}

const AddEmployees = () => {
  const [formData, setFormData] = useState<Employee>({
    name: '',
    address: '',
    phone: '',
    role: '',
    salary: 0,
    status: 'Active', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/employees/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      setFormData({
        name: '',
        address: '',
        phone: '',
        role: '',
        salary: 0,
        status: 'Active',
      });
      router.push('/dashboard/employees');
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <h2>Add New Employee</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <Input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControl fullWidth required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleSelectChange}
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Developer">Staff</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth required>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <Input
            name="salary"
            placeholder="Salary"
            type="number"
            value={formData.salary}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            color="primary"
            className={styles.submitButton}
          >
            Add Employee
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddEmployees;
