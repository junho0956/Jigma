import React from 'react';
import styles from './index.module.css'

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <div className={styles.doubleSpinner}></div>
      <div className={styles.doubleSpinner}></div>
    </div>
  );
};

export default Spinner;
