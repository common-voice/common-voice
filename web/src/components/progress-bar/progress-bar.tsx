import * as React from 'react';

import VisuallyHidden from '../visually-hidden/visually-hidden';

import styles from './progress-bar.module.css';

interface Props {
  percentageValue?: number;
}

const ProgressBar = ({ percentageValue = 0 }: Props) => (
  <div className={styles.progress}>
    <VisuallyHidden>{percentageValue}%</VisuallyHidden>
    <div
      className={styles.progressBar}
      style={{ width: `${percentageValue}%` }}
    />
  </div>
);

export default ProgressBar;
