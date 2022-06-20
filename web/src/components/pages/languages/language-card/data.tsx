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

const TRANSLATED_MIN_PROGRESS_PERCENTAGE = 75;

const LanguageCardDataLaunched = ({
  language,
}: {
  language: LanguageStatistics;
}) => {
  const { recordedHours, validatedHours, speakersCount, sentencesCount } =
    language;

  const recordedHoursGoal =
    DAILY_GOALS.speak.find(goal => goal > recordedHours) ||
    DAILY_GOALS.speak[DAILY_GOALS.speak.length - 1];
  const recordedHoursPercentage =
    recordedHours === 0
      ? 0
      : Math.ceil((recordedHours / recordedHoursGoal) * 100);

  const [validatedHoursGoal] = DAILY_GOALS.listen;
  const validatedPercentage =
    validatedHours === 0
      ? 0
      : Math.ceil((validatedHours / validatedHoursGoal) * 100);

  return (
    <div className={styles.Data}>
      <div className={styles.DataItem}>
        <h4 className={styles.DataItemHeading}>
          <IconHours className={styles.DataItemHeadingIcon} />
          <Localized id="language-validation-hours" />
        </h4>
        <p className={styles.DataItemValue}>
          {recordedHours} <small>/ {recordedHoursGoal}</small>
        </p>
        <ProgressBar percentageValue={recordedHoursPercentage} />
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
        <p className={styles.DataItemValue}>{validatedPercentage}%</p>
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
  console.log('sc', sentencesCount);

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
  console.log('language', language, language.sentencesCount);

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
