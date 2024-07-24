'use client'
import React, { useEffect, useState } from 'react';
import styles from '../add/addemployee.module.css';
import { Button, Paper, Input, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

interface Employee {
  _id: string; 
  name: string;
  address: string;
  phone: string;
  role: string;
  salary: number;
  status: string;
  createdAt: string;
}

const SingleEmployee = () => {
  const params = useSearchParams();
  const id = params.get('id');
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:3000/employees/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employee: ${response.status} ${response.statusText}`);
        }
        const employeeData: Employee = await response.json();
        setEmployee(employeeData);
      } catch (error: any) {
        console.log("Error fetching employee", error.message);
      }
    };
    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployee(prevEmployee => {
      if (!prevEmployee) return prevEmployee;
      return {
        ...prevEmployee,
        [name as string]: value
      };
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setEmployee(prevEmployee => {
      if (!prevEmployee) return prevEmployee;
      return {
        ...prevEmployee,
        [name]: value
      };
    });
  };

  const router = useRouter();
  const updateEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!employee) return;

    try {
      const response = await fetch(`http://localhost:3000/employees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      router.push('/dashboard/employees');
    } catch (error) {
      console.error('Failed to update employee', error);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <h2>Edit Employee</h2>
        <form onSubmit={updateEmployee} className={styles.form}>
          <Input
            name="name"
            placeholder="Name"
            value={employee?.name || ''}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <Input
            name="address"
            placeholder="Address"
            value={employee?.address || ''}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={employee?.phone || ''}
            onChange={handleInputChange}
            fullWidth
            required
          />
          
          <FormControl fullWidth required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={employee?.role || ''}
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
              value={employee?.status || 'Active'}
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
            value={employee?.salary || ''}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <Button
            type="submit"
            color="primary"
            className={styles.submitButton}
          >
            Update Employee
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default SingleEmployee;
