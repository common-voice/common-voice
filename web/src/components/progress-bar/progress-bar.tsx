import * as React from 'react';

import VisuallyHidden from '../visually-hidden/visually-hidden';

import styles from './progress-bar.module.css';

interface Props {
  value?: number;
}

const ProgressBar = ({ value = 0 }: Props) => (
  <div className={styles.progress}>
    <VisuallyHidden>{value}%</VisuallyHidden>
    <div className={styles.progressBar} style={{ width: `${value}%` }} />
  </div>
);
