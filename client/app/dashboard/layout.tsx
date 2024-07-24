'use client';
import React, { ReactNode } from 'react';
import styles from '../components/layout.module.css';
import Sidebar from '../components/sidebar/Sidebar';
import { usePathname } from 'next/navigation';
import Header from '../components/header/header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const title = pathname.split('/').pop();
  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.header}>

          <Header title={title || ''} />
        </div>
        <div className={styles.contentContainer}>
          {children}
        </div>
        
      </div>
    </div>
  );
};

export default Layout;
