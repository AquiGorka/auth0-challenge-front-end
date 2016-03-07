import React from 'react';
import styles from './spinner.styl';

export default props => {
  return (
    <div className={styles['spinner-wrapper']}>
      <div className="spinner-css"></div>
    </div>
  );
};
