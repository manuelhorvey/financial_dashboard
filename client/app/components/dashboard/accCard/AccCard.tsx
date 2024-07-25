import React from 'react';
import styles from './acccard.module.css';
import { BiUpArrow } from 'react-icons/bi';
import CircularProgressWithLabel from '../progress/CircularProgressWithLabel';

interface AccCardProps {
  label: string;
  value: string;
  progress: number;
  buttonColor: string;
  progressColor: string;
}

const AccCard: React.FC<AccCardProps> = ({ label, value, progress, buttonColor, progressColor }) => {
  return (
    <div className={styles.accCard} style={{ borderBottom: `4px solid ${buttonColor}` }}>
      <span>{label}</span>
      <div className={styles.grp}>
        <p>{value.toLocaleString()}</p>
        <CircularProgressWithLabel variant="determinate" value={progress} color={progressColor} /> {/* Pass progressColor */}
      </div>
    </div>
  );
};

export default AccCard;
