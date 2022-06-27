import * as React from 'react';
import classNames from 'classnames';

import languageCardStyles from './language-card.module.css';
import styles from './loading-language-card.module.css';

interface LoadingLanguageCardProps {
  type: 'launched' | 'in-progress';
}

const LoadingLanguageCard = ({ type }: LoadingLanguageCardProps) => (
  <div
    className={classNames(
      languageCardStyles.LanguageCard,
      styles.LoadingLanguageCard,
      {
        [styles.Launched]: type === 'launched',
        [styles.InProgress]: type === 'in-progress',
      }
    )}>
    <div className={languageCardStyles.LanguageCardContent}>
      {/* placeholder elements to style with CSS */}
      <div className={styles.Placeholder} />
      <div className={styles.Placeholder} />
      <div className={styles.Placeholder} />
      <div className={styles.Placeholder} />
    </div>
  </div>
);

export default LoadingLanguageCard;
