import React, { useEffect } from 'react';

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

interface Client {
  _id: string;
  name: string;
  location: string;
  grossCommission: number;
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

interface StatementCalculationsProps {
  statements: Statement[];
  clients: Client[];
  setCalculatedStatements: React.Dispatch<React.SetStateAction<Calculation[]>>;
}

const StatementCalculations: React.FC<StatementCalculationsProps> = ({ statements, clients, setCalculatedStatements }) => {
  useEffect(() => {
    const calculateValues = () => {
      const results = statements.map(statement => {
        const client = clients.find(client => client._id === statement.clientId);
        if (!client) return null;

        const grossCommission = client.grossCommission;
        const totalGross = statement.gross.reduce((acc, curr) => acc + curr, 0);
        const totalBooks = statement.books.reduce((acc, curr) => acc + curr, 0);
        const totalNet = totalGross * (1 - grossCommission / 100);
        const balanceOffice = totalNet - statement.wins;
        const revenue = totalNet; 

        let balanceValue = balanceOffice || 0;
        let balanceClientValue = 0;

        const cashOfficeValue = statement.cashOffice || 0;
        const prevbalOfficeValue = statement.prevbalOffice || 0;
        const cashClientValue = statement.cashClient || 0;
        const prevbalClientValue = statement.prevbalClient || 0;

        let calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
        let calculatedFinalBalanceClient = balanceClientValue + prevbalClientValue - balanceValue - cashOfficeValue - prevbalOfficeValue;

        const finalbalanceClient = calculatedFinalBalanceClient < 0 ? 0 : calculatedFinalBalanceClient;

        if (balanceValue < 0) {
          balanceClientValue = -balanceValue;
          balanceValue = 0;
          calculatedFinalBalance = 0;
        } else {
          if (calculatedFinalBalanceClient < 0) {
            calculatedFinalBalance = -calculatedFinalBalanceClient;
            calculatedFinalBalance = balanceValue + prevbalOfficeValue + cashOfficeValue - prevbalClientValue - cashClientValue;
          }
        }

        return {
          clientId: statement.clientId,
          clientName: statement.clientName,
          totalGross,
          totalBooks,
          totalNet,
          balanceOffice: calculatedFinalBalance < 0 ? 0 : calculatedFinalBalance,
          finalbalanceClient,
          balanceClient: balanceClientValue,
          revenue,
        };
      }).filter(result => result !== null);

      setCalculatedStatements(results as Calculation[]);
    };

    calculateValues();
  }, [statements, clients, setCalculatedStatements]);

  return null; // or any other UI rendering if needed
};

export default StatementCalculations;
