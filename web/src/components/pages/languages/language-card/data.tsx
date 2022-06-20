import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { LanguageStatistics } from 'common';
import { DAILY_GOALS } from '../../../../constants';

import ProgressBar from '../../../progress-bar/progress-bar';
import {
  IconHours,
  IconLocalized,
  IconSentences,
  IconSpeakers,
  IconValidationProgress,
} from './icons';

import styles from './data.module.css';

const TRANSLATED_MIN_PROGRESS_PERCENTAGE = 60;

const LanguageCardDataLaunched = ({
  language,
}: {
  language: LanguageStatistics;
}) => {
  const { recordedHours, validatedHours, speakersCount, sentencesCount } =
    language;

  const validationPercent =
    validatedHours && recordedHours
      ? Math.ceil(validatedHours / recordedHours) * 100
      : 0;

  return (
    <div className={styles.Data}>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconHours className={styles.DataItemHeadingIcon} />
          <Localized id="language-validation-hours" />
        </h4>
        <p className={styles.DataItemValue}>{recordedHours}</p>
      </div>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconSpeakers className={styles.DataItemHeadingIcon} />
          <Localized id="language-speakers" />
        </h4>
        <p className={styles.DataItemValue}>{speakersCount}</p>
      </div>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconValidationProgress className={styles.DataItemHeadingIcon} />
          <Localized id="language-validation-progress" />
        </h4>
        <p className={styles.DataItemValue}>{validationPercent}%</p>
        <ProgressBar percentageValue={validationPercent} />
      </div>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconSentences className={styles.DataItemHeadingIcon} />
          <Localized id="sentences" />
        </h4>
        <p className={styles.DataItemValue}>{sentencesCount.currentCount}</p>
      </div>
    </div>
  );
};

const LanguageCardDataInProgress = ({
  language,
}: {
  language: LanguageStatistics;
}) => {
  const { sentencesCount, localizedPercentage } = language;

  return (
    <div className={styles.Data}>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconLocalized className={styles.DataItemHeadingIcon} />
          <Localized id="localized" />
        </h4>
        <p
          className={classNames(styles.DataItemValue, {
            [styles.DataItemValuePassed]:
              localizedPercentage > TRANSLATED_MIN_PROGRESS_PERCENTAGE,
          })}>
          {localizedPercentage}%
        </p>
      </div>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconSentences className={styles.DataItemHeadingIcon} />
          <Localized id="sentences" />
        </h4>
        <p
          className={classNames(styles.DataItemValue, {
            [styles.DataItemValuePassed]:
              sentencesCount.currentCount >= sentencesCount.targetSentenceCount,
          })}>
          {sentencesCount.currentCount}
          <small> / {sentencesCount.targetSentenceCount}</small>
        </p>
      </div>
    </div>
  );
};

const LanguageCardData = ({
  type,
  language,
}: {
  type: 'launched' | 'in-progress';
  language: LanguageStatistics;
}) => {
  if (type === 'launched') {
    return (
      <LanguageCardDataLaunched language={language as LanguageStatistics} />
    );
  }

  if (type === 'in-progress') {
    return (
      <LanguageCardDataInProgress language={language as LanguageStatistics} />
    );
  }

  return null;
};

export default LanguageCardData;
