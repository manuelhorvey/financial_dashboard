import React from 'react';
import styles from './footer.module.css';
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.logo}>
          Better Intelligence Research Development
        </div>
        <div className={styles.socialMedia}>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={24} />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={24} />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>
      <div className={styles.bottomSection}>
        <p>&copy; {new Date().getFullYear()} Better Intelligence Research Development. All rights reserved.</p>
        <p>Contact us at info@betterintelligence.com</p>
      </div>
    </footer>
  );
};

export default Footer;
