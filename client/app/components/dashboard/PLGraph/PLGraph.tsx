'use client';
import React, { useEffect, useState } from 'react';
import styles from './PLGraph.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Statement {
  _id: {
    month: number;
    clientId: string;
    clientName: string;
  };
  grossCommission: number;
  totalGross: number;
  totalBooks: number;
  wins: number;
  prevbalOffice: number;
  cashOffice: number;
  prevbalClient: number;
  cashClient: number;
}

const PLGraph: React.FC = () => {
  const [data, setData] = useState<{ name: string; profit: number; loss: number }[]>([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch('http://localhost:3000/statements/current/current-year');
        if (!response.ok) throw new Error('Network response was not ok');
        const statementsData: Statement[] = await response.json();

        const monthlyData = Array.from({ length: 12 }, (_, index) => ({
          name: new Date(0, index).toLocaleString('default', { month: 'short' }),
          profit: 0,
          loss: 0
        }));

        statementsData.forEach(statement => {
          const monthIndex = statement._id.month - 1;
          const grossCommissionRate = statement.grossCommission / 100;
          const totalNet = statement.totalGross * (1 - grossCommissionRate);
          const balanceOfficeValue = totalNet - statement.wins;

          const cashOfficeValue = statement.cashOffice || 0;
          const prevbalOfficeValue = statement.prevbalOffice || 0;
          const cashClientValue = statement.cashClient || 0;
          const prevbalClientValue = statement.prevbalClient || 0;

          let balanceValue = balanceOfficeValue || 0;
          let balanceClientValue = 0;

          let calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
          let calculatedFinalBalanceClient = balanceClientValue + prevbalClientValue - balanceValue - cashOfficeValue - prevbalOfficeValue;

          // Ensure both profit and loss are tracked separately
          if (calculatedFinalBalance > 0) {
            monthlyData[monthIndex].profit += calculatedFinalBalance;
          }
          if (calculatedFinalBalanceClient > 0) {
            monthlyData[monthIndex].loss += calculatedFinalBalanceClient;
          }

          // Print each month's profit and loss to the console
          console.log(`Month: ${monthlyData[monthIndex].name}`);
          console.log(`Profit: ${monthlyData[monthIndex].profit.toFixed(2)} M`);
          console.log(`Loss: ${monthlyData[monthIndex].loss.toFixed(2)} M`);
        });

        // Format data: divide by 1,000,000 and round to 2 decimal places
        const formattedData = monthlyData.map(item => ({
          name: item.name,
          profit: parseFloat((item.profit / 1_000_000).toFixed(2)),
          loss: parseFloat((item.loss / 1_000_000).toFixed(2))
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStatements();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Monthly P&L Graph</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${value} M`} />
          <Tooltip formatter={(value) => `${value} M`} />
          <Legend />
          <Line type="monotone" dataKey="profit" stroke="#27ae60" fill="#82ca9d" strokeWidth={2} />
          <Line type="monotone" dataKey="loss" stroke="#C70039" fill="#ff4d4f" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PLGraph;
