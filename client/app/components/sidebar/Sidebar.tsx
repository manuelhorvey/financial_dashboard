import React from 'react';
import styles from './sidebar.module.css';
import { GiPayMoney } from 'react-icons/gi';
import { FaUser, FaFileAlt } from 'react-icons/fa';
import { MdDashboard, MdLogout } from 'react-icons/md';
import { BiGroup } from 'react-icons/bi';
import { GrAnalytics } from 'react-icons/gr';
import MenuLink from './menulink/menulink';
import Image from 'next/image';
import { usePathname} from 'next/navigation';

interface SidebarProps {
  expensesSummary?: {
    totalExpenses: number;
    totalVendors: number;
    latestExpenseDate: string;
    totalPreviousWeek:number;
    totalCurrentWeek:number;
  };
  employeesSummary?: {
    totalEmployees: number;
    activeEmployees: number;
    totalSalary:number;
    latestHireDate: string;
  };
  clientsSummary?: {
    totalClients: number;
    activeClients: number;
   
  };
}

const menuItems = [
  {
    title: 'Pages',
    list: [
      {
        title: 'Overview',
        path: '/dashboard',
        icon: <MdDashboard />,
      },
      {
        title: 'Employees',
        path: '/dashboard/employees',
        icon: <FaUser />,
      },
      {
        title: 'Expenses',
        path: '/dashboard/expenses',
        icon: <GiPayMoney />,
      },
      {
        title: 'Clients',
        path: '/dashboard/clients',
        icon: <BiGroup />,
        subMenu: [
          {
            title: 'Statements',
            path: '/dashboard/clients/statements',
            icon: <FaFileAlt />,
          },
        ],
      },
    ],
  },
  {
    title: 'Analytics',
    list: [
      {
        title: 'Reports',
        path: '/dashboard/reports',
        icon: <GrAnalytics />,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ expensesSummary ,employeesSummary,clientsSummary }) => {
  const pathname = usePathname();
  const isExpensesPage = pathname === '/dashboard/expenses';
  const isEmployeesPage = pathname === '/dashboard/employees';
  const isClientsPage = pathname === '/dashboard/clients';

  

  return (
    <div className={styles.container}>
      <div className={styles.user}>
        {/* <Image
          src="/newLogo.png"
          alt="logo"
          width={100}
          height={100}
          className={styles.userImage}
        /> */}
      </div>
      <ul>
        {menuItems.map((cat) => (
          <li key={cat.title} className={styles.category}>
            <span className={styles.catTitle}>{cat.title}</span>
            <ul className={styles.list}>
              {cat.list.map((item) => (
                <li key={item.title} className={styles.listItem}>
                  <MenuLink item={item} />
                  {item.subMenu && (
                    <ul className={styles.subMenu}>
                      {item.subMenu.map((subItem) => (
                        <li key={subItem.title} className={styles.subMenuItem}>
                          <MenuLink item={subItem} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {isExpensesPage && expensesSummary && (
        <div className={styles.expensesSummary}>
          <h3>Expense Summary</h3>
          <p>Total Expenses: ${expensesSummary.totalExpenses.toFixed(2)}</p>
          <p>Total Vendors: {expensesSummary.totalVendors}</p>
          <p>totalPreviousWeek: {expensesSummary.totalPreviousWeek}</p>
          <p>totalCurrentWeek: {expensesSummary.totalCurrentWeek}</p>
          <p>Latest Expense Date: {new Date( expensesSummary.latestExpenseDate).toLocaleDateString()}</p>
        </div>
      )}
      {isEmployeesPage && employeesSummary && (
        <div className={styles.employeesSummary}>
          <h3>Employee Summary</h3>
          <p>Total Employees: {employeesSummary.totalEmployees}</p>
          <p>Active Employees: {employeesSummary.activeEmployees}</p>
          <p>Total Salary: {employeesSummary.totalSalary}</p>
          <p>Latest Hire Date: {new Date(employeesSummary.latestHireDate).toLocaleDateString()}</p>
        </div>
      )}
      {isClientsPage && clientsSummary && (
        <div className={styles.clientsSummary}>
          <h3>Employee Summary</h3>
          <p>Total Clients: {clientsSummary.totalClients}</p>
          <p>Active Clients: {clientsSummary.activeClients}</p>
          
        </div>
      )}
      <button className={styles.logout}>
        <MdLogout />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
