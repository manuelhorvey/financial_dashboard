'use client';
import React, { useState } from 'react';
import styles from './addclient.module.css';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Clients {
  name: string;
  phone: string;
  location: string;
  grossCommission: number;
  winsCommission: number;
  isActive: boolean;
}

const AddClient = () => {
  const [formData, setFormData] = useState<Clients>({
    name: '',
    phone: '',
    location: '',
    grossCommission: 0,
    winsCommission: 0,
    isActive: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'isActive' ? value === 'true' : value,
    }));
  };

  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add client');
      }

      setFormData({
        name: '',
        phone: '',
        location: '',
        grossCommission: 0,
        winsCommission: 0,
        isActive: false,
      });

      toast.success('Client added successfully'); // Show success toast
      router.push('/dashboard/clients');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client'); // Show error toast
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.header}>
        <h3>Add a New Client</h3>
        <p>Easily add a new client in a few steps</p>
      </div>
      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>
              Name
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Location
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Active
              <select
                name="isActive"
                value={formData.isActive.toString()}
                onChange={handleInputChange}
                required
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          </div>
          <div className={styles.formGroup}>
            <label>
              Gross Commission
              <input
                type="number"
                name="grossCommission"
                placeholder="Gross Commission"
                value={formData.grossCommission}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Wins Commission
              <input
                type="number"
                name="winsCommission"
                placeholder="Wins Commission"
                value={formData.winsCommission}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
          <button className={styles.button} type="submit">Add Client</button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
