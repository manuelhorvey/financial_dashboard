'use client';
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import AccCard from '../components/dashboard/accCard/AccCard';
import PLGraph from '../components/dashboard/PLGraph/PLGraph';
import IncomeChart from '../components/dashboard/Incomegraph/clientIncomegraph';
import StatementCalculations from '../components/dashboard/statementcalculations/statmenetcalc';

interface Clients {
  _id: string;
  name: string;
  location: string;
  grossCommission: number;
}

interface Statement {
  clientId: string;
  clientName: string;
  clientLocation: string;
  startDate: string;
  dueDate: string;
  books: number[];
  gross: number[];
  wins: number;
  prevbalOffice: number;
  cashOffice: number;
  prevbalClient: number;
  cashClient: number;
}

interface Expense {
  _id: string;
  expense: string;
  vendor: string;
  details: string;
  amount: number;
  createdAt: string;
}

interface Calculation {
  clientId: string;
  clientName: string;
  totalGross: number;
  totalBooks: number;
  totalNet: number;
  balanceOffice: number;
  finalbalanceClient: number;
  balanceClient: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const [clients, setClients] = useState<Clients[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [netProfit, setNetProfit] = useState<number>(0);
  const [calculatedStatements, setCalculatedStatements] = useState<Calculation[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const targetRevenue = 500_000_000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsResponse = await fetch('http://localhost:3000/clients/');
        const clientsData = await clientsResponse.json();

        const statementsResponse = await fetch('http://localhost:3000/statements/current/current-week');
        const statementsData = await statementsResponse.json();

        const expensesResponse = await fetch('http://localhost:3000/expenses/current/current-week');
        const expensesData = await expensesResponse.json();

        setClients(clientsData);
        setStatements(statementsData);
        setExpenses(expensesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const totalRevenueCalc = calculatedStatements.reduce((acc, curr) => acc + curr.revenue, 0);
    setTotalRevenue(totalRevenueCalc);

    const totalExpensesCalc = expenses.reduce((acc, curr) => acc + curr.amount, 0); 
    setTotalExpenses(totalExpensesCalc);

    const totalCashOffice = statements.reduce((acc, curr) => acc + curr.cashOffice, 0);
    const prevbalOffice = statements.reduce((acc, curr) => acc + curr.prevbalOffice, 0);
    const prevbalClient = statements.reduce((acc, curr) => acc + curr.prevbalClient, 0);
    const totalCashClient = statements.reduce((acc, curr) => acc + curr.cashClient, 0);
    const wins = statements.reduce((acc, curr) => acc + curr.wins, 0);

    const netProfitCalc = totalRevenueCalc + prevbalOffice +totalCashOffice -wins  -prevbalClient - totalExpensesCalc -totalCashClient;
    setNetProfit(netProfitCalc);
  }, [calculatedStatements, expenses]);

  const revenueProgress = (totalRevenue / targetRevenue) * 100;

  return (
    <div className={styles.container}>
      <div className={styles.accSummary}>
        <AccCard
          label="TOTAL EXPENSE"
          value={`${(totalExpenses/ 1_000_000).toFixed(2)}M`}
          progress={(totalExpenses / targetRevenue) * 100}
          buttonColor="#4caf50"
          progressColor="#4caf50"
        />

        <AccCard
          label="REVENUE"
          value={`${(totalRevenue / 1_000_000).toFixed(2)}M`}
          progress={revenueProgress}
          buttonColor="#FFC300"
          progressColor='#FFC300'
        />

        <AccCard
          label="NET PROFIT"
          value={`${(netProfit / 1_000_000).toFixed(2)}M`}
          progress={(netProfit / targetRevenue) * 100}
          buttonColor="#2196f3"
          progressColor='#2196f3'
        />

        <AccCard
          label="NEW EMPLOYEE"
          value={"+ 5 enrolled"}
          progress={20}
          buttonColor="#C70039"
          progressColor='#C70039'
        />

        <StatementCalculations
          statements={statements}
          clients={clients}
          setCalculatedStatements={setCalculatedStatements}
        />
      </div>

      <div className={styles.graphs}>
        <div className={styles.pL}>
          <PLGraph />
        </div>
        <div className={styles.Income}>
          <IncomeChart />
        </div>
      </div>

      {/* <div className={styles.card}>
        <AccCard
          label="Income"
          value={"5,446"}
          progress={14}
          buttonColor="#C70039"
          progressColor='#C70039'
        />
        <AccCard
          label="Expense"
          value={"4,764"}
          progress={8}
          buttonColor="#C70039"
          progressColor='#C70039'
        />
      </div> */}
    </div>
  );
};

export default Dashboard;
