'use client'
import React from 'react';
import styles from './PLGraph.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  { name: 'Jan', profit: 4000, loss: 2400 },
  { name: 'Feb', profit: 5000, loss: 1398 },
  { name: 'Mar', profit: 5000, loss: 2800 },
  { name: 'Apr', profit: 7780, loss: 3908 },
  { name: 'May', profit: 1890, loss: 4800 },
  { name: 'Jun', profit: 2390, loss: 3800 },
  { name: 'Jul', profit: 3490, loss: 4300 },
  { name: 'Aug', profit: 4000, loss: 2400 },
  { name: 'Sep', profit: 3000, loss: 1398 },
  { name: 'Oct', profit: 2000, loss: 9800 },
  { name: 'Nov', profit: 2780, loss: 3908 },
  { name: 'Dec', profit: 1890, loss: 4800 },
];

const PLGraph: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Monthly P&L Graph</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
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
          <Line type="monotone" dataKey="profit" stroke="#27ae60" fill="#82ca9d" />
          <Line type="monotone" dataKey="loss" stroke="#C70039" fill="#ff4d4f" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PLGraph;
