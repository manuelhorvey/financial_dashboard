'use client'
import React, { useState } from 'react';
import styles from './addexpense.module.css';
import { Button, Paper, Input } from '@mui/material';
import { useRouter } from 'next/navigation';

interface Expense {
  expense: string;
  vendor: string;
  details: string;
  amount: number;
}


const AddExpense = () => {
  const [formData, setFormData] = useState<Expense>({
    expense:'',
    vendor: '',
    details: '',
    amount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevformData) =>({
      ...prevformData,
      [name]: value
    }));
  };

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/expenses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      setFormData({
        expense:'',
        vendor: '',
        details: '',
        amount: 0,
      });
      router.push('/dashboard/expenses');
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper}>
        <div className={styles.header}>
          <h2>Add New Expense</h2>
          <p>Easily add expense in few steps</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            <Input
              name="expense"
              placeholder="Expense Title"
              value={formData.expense}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="vendor"
              placeholder="Vendor"
              value={formData.vendor}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="details"
              placeholder="Details"
              value={formData.details}
              onChange={handleChange}
              fullWidth
              required
            />
            <Input
              name="amount"
              placeholder="Amount"
              type="number"
              value={formData.amount}
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
            Add Expense
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default AddExpense;
