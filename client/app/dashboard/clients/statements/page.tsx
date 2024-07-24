'use client'
import React, { useState, useEffect } from 'react';
import styles from './statements.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

interface Statement {
  _id: string;
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

const Statements = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientid');
  const grossCommission = searchParams.get('C') ?? '0';
  const [statements, setStatements] = useState<Statement[]>([]);
  
  const calculateGrossTotal = (gross: number[]): number => {
    return gross.reduce((acc, curr) => acc + curr, 0);
  };

  const calculateNetTotal = (grossTotal: number): number => {
    const netTotal = grossTotal * (1 - (parseFloat(grossCommission) / 100));
    return parseFloat(netTotal.toFixed(2));
  };
  
  
  const calculateBalance = (grossTotal: number, wins: number): JSX.Element => {
    const balance = calculateNetTotal(grossTotal) - wins;
    const formattedBalance = Number(balance.toFixed(2));

    if (balance < 0) {
      return <span className={styles.red}>{formattedBalance}</span>;
    } else {
      return <span className={styles.green}>{formattedBalance}</span>;
    }
  };
  
  useEffect(() => {
    const getStatements = async () => {
      if (!clientId) {
        console.error('Client ID is not provided');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/statements/${clientId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch client statement: ${response.status} ${response.statusText}`);
        }
        const statementData = await response.json();
        setStatements(statementData);
      } catch (error) {
        console.error('Error fetching statements', error);
      }
    };

    getStatements();
  }, [clientId]);

  const handleButtonClick = () => {
    if (clientId) {
      router.push(`/dashboard/clients/statements/add?id=${clientId}&C=${grossCommission}`);
    } else {
      console.error('clientId is null or undefined');
    }
  };
  


  const handleEditClick = (_id: string) => {
    router.push(`/dashboard/clients/statements/edit?id=${_id}&&C=${grossCommission}&&clientId=${clientId}`);
  };

  const handleViewClick = (_id: string) => {
    router.push(`/view/v?id=${_id}&&clientId=${clientId}&&C=${grossCommission}`);
  };

  const handlePrintClick = (id: string) => {
    console.log(`Print statement ${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.info}>
          <h3>Access, Manage and Add Client Statements</h3>
          <p>Detailed info about managing clients' statements</p>
        </div>
        <div className={styles.button}>
          <Button onClick={handleButtonClick} variant="contained" color="primary">
            New Statement
          </Button>
        </div>
      </div>
      <div className={styles.content}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Statement#</TableCell>
                <TableCell align="right">Start Date</TableCell>
                <TableCell align="right">Due Date</TableCell>
                <TableCell align="right">Client Name</TableCell>
                <TableCell align="right">Gross</TableCell>
                <TableCell align="right">Net</TableCell>
                <TableCell align="right">Wins</TableCell>
                <TableCell align="right">Balance</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statements.map((statement) => (
                <TableRow key={statement._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{statement._id}</TableCell>
                  <TableCell align="right">{new Date(statement.startDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{new Date(statement.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{statement.clientName}</TableCell>
                  <TableCell align="right">{calculateGrossTotal(statement.gross)}</TableCell>
                  <TableCell align="right">{calculateNetTotal(calculateGrossTotal(statement.gross))}</TableCell>
                  <TableCell align="right">{statement.wins}</TableCell>
                  <TableCell align="right">{calculateBalance(calculateGrossTotal(statement.gross), statement.wins)}</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="primary" size="small" sx={{marginRight:'10px'}} onClick={() => handleEditClick(statement._id)}>Edit</Button>
                    <Button variant="outlined" size="small" onClick={() => handleViewClick(statement._id)}>View</Button>
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

export default Statements;
