'use client'
import React, { useState, useEffect } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Input, Typography, Button } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

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


const singleStatement = () => {
  const params = useSearchParams();
  const statementId = params.get('id');
  const clientId = params.get('clientId');
  const grossCommission = parseFloat(params.get('C') || '0');

  const [statement, setStatement] = useState<Statement>({
    clientId: '',
    clientName: '',
    clientLocation: '',
    startDate: '',
    dueDate: '',
    books: [],
    gross: [],
    wins: 0,
    prevbalOffice: 0,
    cashOffice: 0,
    prevbalClient: 0,
    cashClient: 0,
  });

  const [balance, setBalance] = useState<number>(0);
  const [balanceClient, setBalanceClient] = useState<number>(0);
  const [finalbalanceOffice, setFinalbalanceOffice] = useState<number>(0);
  const [finalbalanceClient, setFinalbalanceClient] = useState<number>(0);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const response = await fetch(`http://localhost:3000/statements/${clientId}/${statementId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch statement: ${response.status} ${response.statusText}`);
        }
        const statementData = await response.json();
        setStatement(statementData);
      } catch (error) {
        console.error("Error fetching statement:", error);
      }
    }
    fetchStatement();
  }, [clientId, statementId]);

  const handleBookChange = (index: number, value: string) => {
    const updatedBooks = [...statement.books];
    updatedBooks[index] = parseFloat(value);
    setStatement({ ...statement, books: updatedBooks });
  };

  const handleGrossChange = (index: number, value: number) => {
    const updatedGross = [...statement.gross];
    updatedGross[index] = value;
    setStatement({ ...statement, gross: updatedGross });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStatement({ ...statement, [name]: parseFloat(value) });
  };

  const handleDateChange = (value: string, field: keyof Statement) => {
    setStatement({ ...statement, [field]: value });
  };
  const formatDate = (dateString: string): string => {
    // Check if dateString is empty or not a valid date
    if (!dateString || isNaN(Date.parse(dateString))) {
      return ''; // or handle default case as needed
    }

    const date = new Date(dateString);
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
  };


  const router = useRouter();

  const updateStatement = async () => {
    try {
      const response = await fetch(`http://localhost:3000/statements/${clientId}/${statementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statement),
      });
      if (!response.ok) {
        throw new Error(`Failed to update statement: ${response.status} ${response.statusText}`);
      }
      console.log('Statement updated successfully!');
      router.back();
    } catch (error) {
      console.error("Error updating statement:", error);
    }
  };

  const totalGross = statement.gross.reduce((acc, curr) => acc + curr, 0);
  const totalBooks = statement.books.reduce((acc, curr) => acc + curr, 0);
  const totalNet = totalGross * (1 - ((grossCommission) / 100));
  const balanceOffice = (totalNet - statement.wins).toFixed(2);

  let cashOfficeValue = statement.cashOffice;
  let cashClientValue = statement.cashClient;

  useEffect(() => {
    const balanceOfficeValue = parseFloat(balanceOffice);
    let balanceClientValue: number = 0;
    let balanceValue: number = 0;

    if (balanceOfficeValue < 0) {
      balanceClientValue = -balanceOfficeValue;
    } else {
      balanceValue = balanceOfficeValue;
    }

    // Initial calculation for final balance
    let calculatedFinalBalance: number = balanceValue + statement.prevbalOffice + cashOfficeValue - statement.prevbalClient - cashClientValue - balanceClientValue;
    if (calculatedFinalBalance < 0) {
      calculatedFinalBalance = 0;
    }

    // Calculate final balance for the client
    let calculatedFinalBalanceClient = balanceClientValue + statement.prevbalClient - cashOfficeValue - statement.prevbalOffice;
    if (balanceClientValue < 0 || balanceClientValue === 0) {
      calculatedFinalBalanceClient = 0;
    }

    setBalance(balanceValue);
    setBalanceClient(balanceClientValue);
    setFinalbalanceOffice(calculatedFinalBalance);
    setFinalbalanceClient(calculatedFinalBalanceClient);
  }, [balanceOffice, statement.prevbalOffice, statement.prevbalClient, cashClientValue, cashOfficeValue]);

  return (
    <div >
      <div >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} size='small' aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={3}>
                  <label>
                    Name:
                    <Input type='text' value={statement.clientName} readOnly />
                  </label>
                  <label>
                    Location:
                    <Input type='text' value={statement.clientLocation} readOnly />
                  </label>
                  <label>
                    Start date:
                    <Input
                      type='date'
                      value={formatDate(statement.startDate)}
                      onChange={(e) => handleDateChange(e.target.value, 'startDate')}
                    />
                  </label>
                  <label>
                    Due date:
                    <Input
                      type='date'
                      value={formatDate(statement.dueDate)}
                      onChange={(e) => handleDateChange(e.target.value, 'dueDate')}
                    />
                  </label>
                  <label>
                    Books Total:
                    {totalBooks}
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
                      value={statement.books[index]}
                      sx={{ textAlign: "right" }}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handleBookChange(index, e.target.value)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Input
                      type="number"
                      placeholder="Gross"
                      value={statement.gross[index]}
                      sx={{ textAlign: "right" }}
                      inputProps={{ style: { textAlign: "right" } }}
                      onChange={(e) => handleGrossChange(index, parseFloat(e.target.value))}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell />
                <TableCell>Gross</TableCell>
                <TableCell align='right'>{totalGross}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Net</TableCell>
                <TableCell align='right'>{totalNet.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Wins</TableCell>
                <TableCell align='right'>
                  <Input
                    type='number'
                    name="wins"
                    value={statement.wins}
                    inputProps={{ style: { textAlign: "right" } }}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Balance</TableCell>
                <TableCell align='right'>{balance}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Previous Balance:Office</TableCell>
                <TableCell align='right'>
                  <Input
                    type='number'
                    name="prevbalOffice"
                    value={statement.prevbalOffice}
                    inputProps={{ style: { textAlign: "right" } }}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Cash:Office</TableCell>
                <TableCell align='right'>
                  <Input
                    type='number'
                    name="cashOffice"
                    value={statement.cashOffice}
                    inputProps={{ style: { textAlign: "right" } }}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell />
                <TableCell>Final Balance:Office</TableCell>
                <TableCell align='right'>{finalbalanceOffice.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Balance:Client</TableCell>
                <TableCell align='right'>{balanceClient}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Previous Balance:Client</TableCell>
                <TableCell align='right'>
                  <Input
                    type='number'
                    name="prevbalClient"
                    value={statement.prevbalClient}
                    inputProps={{ style: { textAlign: "right" } }}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Cash:Client</TableCell>
                <TableCell align='right'>
                  <Input
                    type='number'
                    name="cashClient"
                    value={statement.cashClient}
                    inputProps={{ style: { textAlign: "right" } }}
                    onChange={handleInputChange}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell />
                <TableCell>Final Balance:Client</TableCell>
                <TableCell align='right'>{finalbalanceClient.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button
            variant="contained"
            onClick={() => updateStatement()}
            sx={{ margin: '10px' }}
          >
            Update Statement
          </Button>
        </TableContainer>
      </div>
    </div>
  );
};

export default singleStatement;
