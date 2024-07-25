'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Input, Typography, Button } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './addstatement.module.css';

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

const AddStatement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('id');
  const C = searchParams.get('C');

  const [clientName, setClientName] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>('');
  const [grossCommission, setGrossCommission] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [bookValues, setBookValues] = useState<number[]>(Array(7).fill(0));
  const [grossValues, setGrossValues] = useState<number[]>(Array(7).fill(0));
  const [wins, setWins] = useState<number>(0);
  const [prevbalOffice, setPrevbalOffice] = useState<number>(0);
  const [cashOffice, setCashOffice] = useState<number>(0);
  const [prevbalClient, setPrevbalClient] = useState<number>(0);
  const [cashClient, setCashClient] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [balanceClient, setBalanceClient] = useState<number>(0);
  const [finalbalanceOffice, setFinalbalanceOffice] = useState<number>(0);
  const [finalbalanceClient, setFinalbalanceClient] = useState<number>(0);

  const handleGrossChange = useCallback((index: number, value: string) => {
    setGrossValues((prev) => {
      const updatedGrossValues = [...prev];
      updatedGrossValues[index] = parseFloat(value) || 0;
      return updatedGrossValues;
    });
  }, []);

  const handleBookChange = useCallback((index: number, value: string) => {
    setBookValues((prev) => {
      const updatedBookValues = [...prev];
      updatedBookValues[index] = parseFloat(value) || 0;
      return updatedBookValues;
    });
  }, []);

  useEffect(() => {
    const getClients = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clients/${clientId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status} ${response.statusText}`);
        }
        const clientData: Clients = await response.json();
        setClientName(clientData.name);
        setClientLocation(clientData.location);
        setGrossCommission(clientData.grossCommission);
      } catch (error: any) {
        console.error(`Error fetching client: ${error.message}`);
      }
    };

    if (clientId) {
      getClients();
    }
  }, [clientId]);

  const handleWinsChange = useCallback((value: string) => {
    setWins(parseFloat(value) || 0);
  }, []);

  const handlePrevbalChange = useCallback((value: string) => {
    setPrevbalOffice(parseFloat(value) || 0);
  }, []);

  const handlePrevbalChangeClient = useCallback((value: string) => {
    setPrevbalClient(parseFloat(value) || 0);
  }, []);

  const handleCashOffice = useCallback((value: string) => {
    setCashOffice(parseFloat(value) || 0);
  }, []);

  const handleCashClient = useCallback((value: string) => {
    setCashClient(parseFloat(value) || 0);
  }, []);

  const totalGross = grossValues.reduce((acc, curr) => acc + curr, 0);
  const totalBooks = bookValues.reduce((acc, curr) => acc + curr, 0);
  const totalNet = totalGross * (1 - grossCommission / 100);
  const balanceOffice = totalNet - wins;

  
  useEffect(() => {
    let balanceValue = balanceOffice || 0;
    let balanceClientValue = 0;
    
    const cashOfficeValue = cashOffice || 0;
    const prevbalOfficeValue = prevbalOffice || 0;
    const cashClientValue = cashClient || 0;
    const prevbalClientValue = prevbalClient || 0;
    setBalance(balanceValue);
    let calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
    let calculatedFinalBalanceClient = balanceClientValue + prevbalClientValue - balanceValue - cashOfficeValue - prevbalOfficeValue;

    setFinalbalanceClient(calculatedFinalBalanceClient < 0 ? 0 : calculatedFinalBalanceClient);

    if (balanceValue < 0) {
      balanceClientValue = -balanceValue;
      setBalanceClient(balanceClientValue);
      setBalance(0);
      setFinalbalanceOffice(0);
    } else {
      if (calculatedFinalBalanceClient < 0) {
        calculatedFinalBalance = -calculatedFinalBalanceClient;
        calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
        setBalanceClient(0)
        setFinalbalanceOffice(calculatedFinalBalance < 0 ? 0 : calculatedFinalBalance);
      } else {
        setFinalbalanceOffice(calculatedFinalBalance < 0 ? 0 : calculatedFinalBalance);
      }
    }
  }, [balanceOffice, prevbalOffice, prevbalClient, cashClient, cashOffice]);

  const handleAddStatement = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const newStatement: Statement = {
      clientId: clientId || '',
      clientName,
      clientLocation,
      startDate,
      dueDate,
      books: bookValues,
      gross: grossValues,
      wins,
      prevbalOffice,
      cashOffice,
      prevbalClient,
      cashClient
    };

    try {
      const response = await fetch('http://localhost:3000/statements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStatement)
      });

      if (!response.ok) {
        throw new Error(`Failed to add statement: ${response.status} ${response.statusText}`);
      }

      router.back();
    } catch (error: any) {
      console.error(`Error adding statement: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchRecentStatement = async () => {
      try {
        const response = await fetch(`http://localhost:3000/statements/recent/${clientId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch recent statement: ${response.status} ${response.statusText}`);
        }
        const recentStatements = await response.json();
        const { wins, cashOffice, cashClient, prevbalOffice, prevbalClient } = recentStatements;

        const totalGross = recentStatements.gross.reduce((acc: number, curr: number) => acc + curr, 0);
        const totalNet = totalGross * (1 - (Number(C) / 100));
        const balanceOffice = totalNet - wins;

        let balanceValue: number = balanceOffice || 0;
        let balanceClientValue: number = 0;

        let calculatedFinalBalance = balanceValue + prevbalOffice + cashOffice - prevbalClient - cashClient;
        let calculatedFinalBalanceClient = balanceClientValue + prevbalClient - balanceValue - cashOffice - prevbalOffice;

        setFinalbalanceClient(calculatedFinalBalanceClient < 0 ? 0 : calculatedFinalBalanceClient);
        
        if (calculatedFinalBalance < 0) {
          balanceClientValue = -calculatedFinalBalance;
          balanceValue = 0;
          calculatedFinalBalance = 0;
        } else {
          if (balanceValue < 0) {
            balanceValue = 0;
          }
          balanceClientValue = 0;
        }

        if (calculatedFinalBalanceClient < 0) {
          calculatedFinalBalanceClient = 0;
        }

        setPrevbalOffice(Number(calculatedFinalBalance.toFixed(2)) || 0);
        setPrevbalClient(Number(calculatedFinalBalanceClient.toFixed(2)) || 0);
      } catch (error: any) {
        console.error(`Error fetching recent statement: ${error.message}`);
      }
    };

    fetchRecentStatement();
  }, [clientId]);

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat().format(number);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <form onSubmit={handleAddStatement}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} size='small' aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    <label>
                      Name:
                      <Input type='text' value={clientName} readOnly />
                    </label>
                    <label>
                      Location:
                      <Input type='text' value={clientLocation} readOnly />
                    </label>
                    <label>
                      Start date:
                      <Input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </label>
                    <label>
                      Due date:
                      <Input type='date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    </label>
                    <label>
                      Books Total:
                      {formatNumber(totalBooks)}
                    </label>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Games</TableCell>
                  <TableCell align="right">Books</TableCell>
                  <TableCell align="right">Gross</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <TableRow key={day}>
                    <TableCell>
                      <Typography>{day}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Input
                        type="number"
                        placeholder="Books"
                        sx={{ textAlign: "right" }}
                        inputProps={{ style: { textAlign: "right" } }}
                        onChange={(e) => handleBookChange(index, e.target.value)}
                        required
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Input
                        type="number"
                        placeholder="Gross"
                        sx={{ textAlign: "right" }}
                        inputProps={{ style: { textAlign: "right" } }}
                        onChange={(e) => handleGrossChange(index, e.target.value)}
                        required
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell />
                  <TableCell>Gross</TableCell>
                  <TableCell align='right'>{formatNumber(totalGross)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Net</TableCell>
                  <TableCell align='right'>{formatNumber(totalNet)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Wins</TableCell>
                  <TableCell align='right'>
                    <Input
                      type='number'
                      value={wins}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handleWinsChange(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Balance</TableCell>
                  <TableCell align='right'>{formatNumber(balance)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Previous Balance: Office</TableCell>
                  <TableCell align='right'>
                    <Input
                      type='number'
                      name='prevbalOffice'
                      value={prevbalOffice}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handlePrevbalChange(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Cash: Office</TableCell>
                  <TableCell align='right'>
                    <Input
                      type='number'
                      value={cashOffice}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handleCashOffice(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Final Balance: Office</TableCell>
                  <TableCell align='right'>{formatNumber(finalbalanceOffice)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Balance: Client</TableCell>
                  <TableCell align='right'>{formatNumber(balanceClient)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Previous Balance: Client</TableCell>
                  <TableCell align='right'>
                    <Input
                      type='number'
                      value={prevbalClient}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handlePrevbalChangeClient(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Cash: Client</TableCell>
                  <TableCell align='right'>
                    <Input
                      type='number'
                      value={cashClient}
                      name='cashClient'
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handleCashClient(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell />
                  <TableCell>Final Balance: Client</TableCell>
                  <TableCell align='right'>{formatNumber(finalbalanceClient)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Button type="submit" variant="contained" color="success" sx={{ margin: '10px' }}>
                      Add Statement
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </form>
      </div>
    </div>
  );
};

export default AddStatement;
