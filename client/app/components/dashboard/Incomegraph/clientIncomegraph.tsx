'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './clientIncomegraph.module.css';

interface Statement {
  _id: {
    grossCommission: number;
  };
  clientId: string;
  clientName: string;
  gross: number[];
  grossCommission: number;
  totalGross: number;
  totalBooks: number;
  wins: number;
  prevbalOffice: number;
  cashOffice: number;
  prevbalClient: number;
  cashClient: number;
}

const IncomeChart: React.FC = () => {
  const [data, setData] = useState<{ name: string, income: number, loss: number }[]>([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch('http://localhost:3000/statements/current/current-week');
        const statementsData: Statement[] = await response.json();

        if (statementsData.length > 0) {
          // Group by client name
          const agentData: { [key: string]: { income: number, loss: number } } = {};

          statementsData.forEach(statement => {
            const clientName = statement.clientName || "Unknown";

            // Sum up the gross array
            const totalGross = statement.gross.reduce((acc, grossAmount) => acc + grossAmount, 0);
            
            const grossCommissionRate = statement.grossCommission / 100;
            const totalNet = totalGross * (1 - grossCommissionRate);
            const balanceOffice = totalNet - statement.wins;
          
            const cashOfficeValue = statement.cashOffice || 0;
            const prevbalOfficeValue = statement.prevbalOffice || 0;
            const cashClientValue = statement.cashClient || 0;
            const prevbalClientValue = statement.prevbalClient || 0;
          
            let balanceValue = balanceOffice || 0;
            let balanceClientValue = 0;
          
            let calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
            let calculatedFinalBalanceClient = balanceClientValue + prevbalClientValue - balanceValue - cashOfficeValue - prevbalOfficeValue;
          
            // Set any value less than 0 to zero
            if (calculatedFinalBalance < 0) calculatedFinalBalance = 0;
            if (calculatedFinalBalanceClient < 0) calculatedFinalBalanceClient = 0;
          
            if (!agentData[clientName]) {
              agentData[clientName] = { income: 0, loss: 0 };
            }
          
            // Correctly sum income and loss
            agentData[clientName].income += parseFloat((calculatedFinalBalance / 1_000_000).toFixed(2)) || 0;
            agentData[clientName].loss += parseFloat((Math.abs(calculatedFinalBalanceClient) / 1_000_000).toFixed(2)) || 0;
          });

          // Convert agent data to array
          const formattedData = Object.keys(agentData).map(clientName => ({
            name: clientName,
            income: agentData[clientName].income,
            loss: agentData[clientName].loss
          }));
          
          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStatements();
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Income and Loss by Agent (Current Week)</h3>
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
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `${value} M`} />
          <Tooltip formatter={(value: number) => `${value} M`} />
          <Legend />
          <Bar dataKey="income" fill="#27ae60" />
          <Bar dataKey="loss" fill="#c0392b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
