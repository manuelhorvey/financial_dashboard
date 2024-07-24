'use client';
import React, { useEffect, useState } from 'react';
import styles from './editexpense.module.css';
import { Button, Paper, Input } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';

interface Expense {
  _id: string;
  expense: string;
  vendor: string;
  details: string;
  amount: number;
}

const EditExpense = () => {
  const params = useSearchParams();
  const id = params.get('id');
  const [expense, setExpense] = useState<Expense | null>(null);
  
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await fetch(`http://localhost:3000/expenses/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch expense: ${response.status} ${response.statusText}`);
        }
        const expenseData: Expense = await response.json();
        setExpense(expenseData);
      } catch (error: any) {
        console.log("Error fetching expense", error.message);
      }
    };
    if (id) {
      fetchExpense();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpense(prevExpense => {
      if (!prevExpense) return prevExpense;
      return {
        ...prevExpense,
        [name]: value
      };
    });
  };

  const router = useRouter();
  const updateExpense = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!expense) return;

    try {
      const response = await fetch(`http://localhost:3000/expenses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to update expense');
      }

      router.push('/dashboard/expenses');
    } catch (error) {
      console.error('Failed to update expense', error);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <div className={styles.header}>
          <h2>Edit Expense</h2>
          <p>Easily edit the expense details</p>
        </div>
        <form onSubmit={updateExpense} className={styles.form}>
          <div className={styles.fields}>
            <Input
              name="expense"
              placeholder="Expense Title"
              value={expense?.expense || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="vendor"
              placeholder="Vendor"
              value={expense?.vendor || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="details"
              placeholder="Details"
              value={expense?.details || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              value={expense?.amount.toString() || ''}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={styles.submitButton}
          >
            Update Expense
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default EditExpense;
