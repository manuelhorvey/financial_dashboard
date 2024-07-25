import React from 'react';
import styles from './dashboard.module.css';
import AccCard from '../components/dashboard/accCard/AccCard';
import PLGraph from '../components/dashboard/PLGraph/PLGraph';
import IncomeChart from '../components/dashboard/Incomegraph/clientIncomegraph';
import { BiUpArrow } from 'react-icons/bi';


const Dashboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.accSummary}>
        <AccCard
          label="TOTAL EXPENSE"
          value={`77 %`}
          progress={80}
          buttonColor="#4caf50"
          progressColor="#4caf50"
        />

        <AccCard
          label="REVENUE"
          value={"1,45M"}
          progress={65}
          buttonColor="#FFC300"
          progressColor='#FFC300'

        />

        <AccCard
          label="NET PROFIT"
          value={"5M"}
          progress={90}
          buttonColor="#2196f3"
          progressColor=''

        />

        <AccCard
          label="NEW EMPLOYEE"
          value={"+ 5 enrolled"}
          progress={20}
          buttonColor="#C70039"
          progressColor='#C70039'

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
      <div className={styles.card}>
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

      </div>
    </div>
  );
};

export default Dashboard;
