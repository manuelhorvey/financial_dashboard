'use client'
import React, { useState, useEffect } from 'react';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import styles from './printview.module.css'

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

const ViewStatement = () => {
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

  const formatDate = (dateString: string): string => {
    if (!dateString || isNaN(Date.parse(dateString))) {
      return '';
    }
    const date = new Date(dateString);
    const isoDate = date.toISOString().split('T')[0];
    return isoDate;
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

    let calculatedFinalBalance: number = balanceValue + statement.prevbalOffice + cashOfficeValue - statement.prevbalClient - cashClientValue - balanceClientValue;
    if (calculatedFinalBalance < 0) {
      calculatedFinalBalance = 0;
    }

    let calculatedFinalBalanceClient = balanceClientValue + statement.prevbalClient - cashOfficeValue - statement.prevbalOffice;
    if (balanceClientValue < 0 || balanceClientValue === 0) {
      calculatedFinalBalanceClient = 0;
    }

    setBalance(balanceValue);
    setBalanceClient(balanceClientValue);
    setFinalbalanceOffice(calculatedFinalBalance);
    setFinalbalanceClient(calculatedFinalBalanceClient);
  }, [balanceOffice, statement.prevbalOffice, statement.prevbalClient, cashClientValue, cashOfficeValue]);

  const formatNumber = (number:any) => {
    return new Intl.NumberFormat().format(number);
  };
  

  return (
    <div className={styles.container}>
      <TableContainer className={`${styles.tableContainer}`} component={Paper}>
          {<div className={styles.header}>
            <div className={styles.companydetails}>
            <h3>DAN SAVIOUR ENTERPRISE</h3>
            <span> 4822, CO C1 TEMA</span>
            <span>KUMASI ROAD OPP ROYALTY CHURCH</span>
            </div>
            <h2 className={styles.headerText}>APPROVED STATEMENT OF ACCOUNT</h2>
          </div>
          }
          <div className={styles.down}></div>
        <Table sx={{ minWidth: 700 }} size='small' aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan={3}>
                <div className={styles.alignVertical}>
                  <Typography variant="h6" className={styles.typographyLabel}>
                    <label className={styles.clientName}>Name:</label> {statement.clientName}
                  </Typography>
                  <Typography variant="h6" className={styles.typographyLabel}>
                    <label className={styles.clientLocation}>Location:</label> {statement.clientLocation}
                  </Typography>
                  <Typography variant="h6" className={styles.typographyLabel}>
                    <label className={styles.startDate}>Start Date:</label> {formatDate(statement.startDate)}
                  </Typography>
                  <Typography variant="h6" className={styles.typographyLabel}>
                    <label className={styles.dueDate}>Due Date:</label> {formatDate(statement.dueDate)}
                  </Typography>
                  <Typography variant="h6" className={styles.typographyLabel}>
                    <label className={styles.totalBooks}>Books Total:</label> {totalBooks}
                  </Typography>
                </div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableRow>
            <TableCell>Games</TableCell>
            <TableCell align="right">Books</TableCell>
            <TableCell align="right">Gross</TableCell>
          </TableRow>
          <TableBody>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
              <TableRow key={day}>
                <TableCell>
                  <Typography sx={{fontWeight:'bold'}}>{day}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography >{statement.books[index]}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography>{formatNumber(statement.gross[index])}</Typography>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell>Gross</TableCell>
              <TableCell align='right' sx={{fontWeight:'bold'}}>{formatNumber(totalGross)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Net</TableCell>
              <TableCell align='right' sx={{fontWeight:'bold'}}>{formatNumber(totalNet.toFixed(2))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Wins</TableCell>
              <TableCell align='right'>
                <Typography >{formatNumber(statement.wins)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Balance</TableCell>
              <TableCell align='right' sx={{fontWeight:'bold'}}>{formatNumber(balance)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Previous Balance: Office</TableCell>
              <TableCell align='right'>
                <Typography>{formatNumber(statement.prevbalOffice)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Cash from: Office</TableCell>
              <TableCell align='right'>
                <Typography>{formatNumber(statement.cashOffice)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Final Balance: Office</TableCell>
              <TableCell align='right' sx={{fontWeight:'bold'}}>{formatNumber(finalbalanceOffice.toFixed(2))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Balance: Client</TableCell>
              <TableCell align='right'sx={{fontWeight:'bold'}}>{formatNumber(balanceClient)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Previous Balance: Client</TableCell>
              <TableCell align='right'>
                <Typography>{formatNumber(statement.prevbalClient)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Cash from: Client</TableCell>
              <TableCell align='right'>
                <Typography>{formatNumber(statement.cashClient)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell />
              <TableCell>Final Balance: Client</TableCell>
              <TableCell align='right' sx={{fontWeight:'bold'}}>{formatNumber(finalbalanceClient.toFixed(2))}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Button
          variant="outlined"
          className={styles.button}
          onClick={() => window.print()}
          sx={{ margin: '10px' }}
        >
          Print Statement
        </Button>
      </TableContainer>
    </div>
  );
};

export default ViewStatement;
