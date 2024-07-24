'use client';
import React, { useEffect, useState } from 'react';
import styles from './expenses.module.css';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/components/sidebar/Sidebar';

interface Expense {
  _id: string;
  expense: string;
  vendor: string;
  details: string;
  amount: number;
  createdAt: string;
}

const Expenses = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalPreviousWeek, setTotalPreviousWeek] = useState<number>(0);
  const [totalCurrentWeek, setTotalCurrentWeek] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddButtonClick = () => {
    router.push('/dashboard/expenses/add');
  };

  const handleEditButtonClick = (id: string) => {
    router.push(`/dashboard/expenses/edit?id=${id}`);
  };

  const fetchExpenses = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const [allExpenses, previousWeekExpenses, currentWeekExpenses] = await Promise.all([
          fetchExpenses('http://localhost:3000/expenses/'),
          fetchExpenses('http://localhost:3000/expenses/current/current-week'),
          fetchExpenses('http://localhost:3000/expenses/recent/previous-week'),
        ]);

        setExpenses(allExpenses);

        const totalCurrentWeek = currentWeekExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
       const totalPreviousWeek = previousWeekExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        
        setTotalPreviousWeek(totalPreviousWeek);
        setTotalCurrentWeek(totalCurrentWeek);

      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching expenses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllExpenses();
  }, []);

  const handleDeleteButtonClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        const response = await fetch(`http://localhost:3000/expenses/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete expense: ${response.status} ${response.statusText}`);
        }
  
        // Remove the deleted expense from the state
        setExpenses(expenses.filter(expense => expense._id !== id));
      } catch (error: any) {
        console.error('Failed to delete expense:', error.message);
      }
    }
  };
  

  const expensesSummary = {
    totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    totalVendors: new Set(expenses.map(expense => expense.vendor)).size,
    latestExpenseDate: expenses.length > 0 ? new Date(expenses[expenses.length - 1].createdAt).toLocaleDateString() : 'N/A',
    totalPreviousWeek,
    totalCurrentWeek
  };



  return (
    <div className={styles.container}>
      <Sidebar expensesSummary={expensesSummary} />
      <div className={styles.header}>
        <div className={styles.info}>
          <h1>Manage all expenses in one place</h1>
          <p>Keep track of every expense made</p>
        </div>
        <div className={styles.button}>
          <Button variant="contained" color="primary" onClick={handleAddButtonClick}>New Expense</Button>
        </div>
      </div>
      <div className={styles.content}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} size='small' aria-label='dense table'>
              <TableHead>
                <TableRow>
                  <TableCell>Expense</TableCell>
                  <TableCell align='right'>Vendor</TableCell>
                  <TableCell align='right'>Date of Creation</TableCell>
                  <TableCell align='right'>Details</TableCell>
                  <TableCell align='right'>Amount</TableCell>
                  <TableCell align='right'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell component="th" scope="row">{expense.expense}</TableCell>
                    <TableCell align='right'>{expense.vendor}</TableCell>
                    <TableCell align='right'>{new Date(expense.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align='right'>{expense.details}</TableCell>
                    <TableCell align='right'>{expense.amount.toFixed(2)}</TableCell>
                    <TableCell align='right'>
                      <Button variant="outlined" color="secondary" size="small" onClick={() => handleEditButtonClick(expense._id)}>Edit</Button>
                      <Button 
                      variant="outlined" 
                      color="error" 
                      size="small" 
                      style={{ marginLeft: 8 }}
                      onClick={() => handleDeleteButtonClick(expense._id)}
                      >Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Expenses;
