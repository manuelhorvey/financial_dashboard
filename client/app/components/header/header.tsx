import React from 'react';
import Link from 'next/link';
import styles from './header.module.css';
import { FaUserCircle } from 'react-icons/fa';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/dashboard">{title}</Link>
      </div>
      <div className={styles.profile}>
        <FaUserCircle size={24} />
        <span className={styles.profileName}>DsEnterprise</span>
      </div>
    </header>
  );
};

export default Header;
