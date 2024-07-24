'use client'
import React, { useEffect, useState } from 'react';
import styles from './employees.module.css';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar/Sidebar';

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

const Employees = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await fetch(`http://localhost:3000/employees/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
        }
        const employeeData = await response.json();
        setEmployees(employeeData);
      } catch (error: any) {
        console.log("Error fetching employees", error.message);
      }
    }
    fetchAllEmployees();
  }, []);

  const handleAddButtonClick = () => {
    router.push('/dashboard/employees/add');
  };

  const handleEditButtonClick = (id: string) => {
    router.push(`/dashboard/employees/edit?id=${id}`);
  };

  const activeEmployees = employees.filter(employee => employee.status === 'Active');
  const totalSalary = activeEmployees.reduce((total, employee) => total + employee.salary, 0);

  const employeesSummary = {
    totalEmployees: employees.length,
    activeEmployees: activeEmployees.length,
    totalSalary: totalSalary,
    latestHireDate: employees.length > 0 ? employees.reduce((latest, employee) =>
      new Date(employee.createdAt) > new Date(latest.createdAt) ? employee : latest, employees[0]
    ).createdAt : 'N/A',
  };

  return (
    <div className={styles.container}>
      <Sidebar employeesSummary={employeesSummary} />
      <div className={styles.header}>
        <div className={styles.info}>
          <h1>Manage all Employees in one place</h1>
          <p>Keep track of every employee</p>
        </div>
        <div className={styles.button}>
          <Button variant="contained" color="primary" onClick={handleAddButtonClick}>New Employee</Button>
        </div>
      </div>
      <div className={styles.content}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} size='small' aria-label='dense table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align='right'>Address</TableCell>
                <TableCell align='right'>Phone</TableCell>
                <TableCell align='right'>Date of Creation</TableCell>
                <TableCell align='right'>Role</TableCell>
                <TableCell align='right'>Salary</TableCell>
                <TableCell align='right'>Status</TableCell>
                <TableCell align='right'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell component='th' scope='row'>
                    {employee.name}
                  </TableCell>
                  <TableCell align='right'>{employee.address}</TableCell>
                  <TableCell align='right'>{employee.phone}</TableCell>
                  <TableCell align='right'>{new Date(employee.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align='right'>{employee.role}</TableCell>
                  <TableCell align='right'>{employee.salary}</TableCell>
                  <TableCell align='right'>{employee.status}</TableCell>
                  <TableCell align='right'>
                    <Button variant="outlined" color="primary" onClick={() => handleEditButtonClick(employee._id)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Employees;
