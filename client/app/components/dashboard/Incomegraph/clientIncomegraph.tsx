'use client'
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './clientIncomegraph.module.css';

// Function to generate random data
const generateRandomData = (numEntries: number) => {
  const names = [
    'Alpha', 'Bravo', 'Charlie', 'Delta', 
    'Echo', 'Foxtrot', 'Golf', 'Hotel', 
    'India', 'Juliet'
  ];
  
  
  const data = [];

  for (let i = 0; i < numEntries; i++) {
    data.push({
      name: names[i % names.length],
      income: Math.floor(Math.random() * 5000) + 1000,  // Random income between 1000 and 6000
      loss: Math.floor(Math.random() * 3000) + 500     // Random loss between 500 and 3500
    });
  }

  return data;
};

const data = generateRandomData(10);

const IncomeChart: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Income from Clients</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar type="monotone" dataKey="income" fill="#27ae60" />
          <Bar type="monotone" dataKey="loss" fill="#c0392b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
