import * as React from 'react';
import { useState } from 'react';
import { DAILY_GOALS } from '../../../constants';
import { RouteComponentProps, withRouter } from 'react-router';
import ContentLoader from 'react-content-loader';
import { InProgressLanguage, LaunchedLanguage } from 'common';
import URLS from '../../../urls';
import { createCrossLocalization } from '../../../services/localization';
import { trackLanguages } from '../../../services/tracker';
import { toLocaleRouteBuilder, useLocale } from '../../locale-helpers';
import ProgressBar from '../../progress-bar/progress-bar';
import { Hr } from '../../ui/ui';
import GetInvolvedModal from './get-involved-modal';
import { Localized, LocalizationProvider } from '@fluent/react';

const SENTENCE_COUNT_TARGET = 5000;

function formatSeconds(totalSeconds: number) {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours >= 1000) {
    return (hours / 1000).toPrecision(2) + 'k';
  }

  const timeParts = [];

  if (hours > 0) {
    timeParts.push(hours + 'h');
  }

  if (hours < 10 && minutes > 0) {
    timeParts.push(minutes + 'm');
  }

  if (hours == 0 && minutes < 10 && seconds > 0) {
    timeParts.push(seconds + 's');
  }

  return timeParts.join(' ') || '0';
}

function Skeleton({
  loading,
  title,
  metricLabel,
  metricValue,
  progressLabel,
  progress,
  progressTotal,
  progressSecondary,
  formatProgress = n => n.toString(),
  children,
  onClick,
}: {
  loading?: boolean;
  title?: React.ReactNode;
  metricLabel?: React.ReactNode;
  metricValue?: React.ReactNode;
  progressLabel?: React.ReactNode;
  progress?: number;
  progressTotal?: number;
  progressSecondary?: boolean;
  formatProgress?: (n: number) => string;
  children?: React.ReactNode;
  onClick?: any;
}) {
  return (
    <li className={'language ' + (loading ? 'loading' : '')}>
      <div className="info">
        <h2>{loading ? <ContentLoader /> : title}</h2>
        <div className="numbers">
          <div>
            {loading ? (
              <ContentLoader height={25} />
            ) : (
              <>
                {metricLabel}
                <b className="value">{metricValue.toLocaleString()}</b>
              </>
            )}
          </div>
          <Hr />
          <div>
            {loading ? (
              <ContentLoader height={25} />
            ) : (
              <>
                {progressLabel}
                <span className="value">
                  <b>{formatProgress(progress)}</b> /{' '}
                  {formatProgress(progressTotal)}
                </span>
              </>
            )}
          </div>
          {loading ? (
            <ContentLoader height={25} />
          ) : (
            <ProgressBar
              progress={progress / progressTotal}
              secondary={progressSecondary}
            />
          )}
        </div>
      </div>
      {loading ? (
        <button>Loading...</button>
      ) : (
        children && <button onClick={onClick}>{children}</button>
      )}
    </li>
  );
}

export function LoadingLocalizationBox() {
  return <Skeleton loading />;
}

type Props = RouteComponentProps<{}> & {
  localeMessages: string[][];
} & (
    | (InProgressLanguage & { type: 'in-progress' })
    | (LaunchedLanguage & { type: 'launched' })
  );

const LocalizationBox = React.memo((props: Props) => {
  const { history, locale, localeMessages } = props;

  const [globalLocale] = useLocale();

  const [showModal, setShowModal] = useState(false);

  const l10n = createCrossLocalization(
    localeMessages, [locale, globalLocale]
  );

  const title = (
    <Localized id={locale}>
      <span />
    </Localized>
  );

  return (
    <>
      {showModal && (
        <LocalizationProvider l10n={l10n}>
          <GetInvolvedModal
            locale={locale}
            onRequestClose={() => setShowModal(false)}
          />
        </LocalizationProvider>
      )}
      {props.type === 'in-progress' ? (
        <Skeleton
          title={title}
          metricLabel={
            <Localized id="localized">
              <span />
            </Localized>
          }
          metricValue={props.localizedPercentage + '%'}
          progressLabel={
            <Localized id="sentences">
              <span />
            </Localized>
          }
          progress={props.sentencesCount}
          progressTotal={SENTENCE_COUNT_TARGET}
          onClick={() => setShowModal(true)}>
          <LocalizationProvider l10n={l10n}>
            <Localized id="get-involved-button">
              <span />
            </Localized>
          </LocalizationProvider>
        </Skeleton>
      ) : (
        <Skeleton
          title={title}
          metricLabel={
            <Localized id="language-speakers">
              <span />
            </Localized>
          }
          metricValue={props.speakers}
          progressLabel={
            <Localized id="total-hours">
              <span />
            </Localized>
          }
          progress={props.seconds}
          progressTotal={
            (DAILY_GOALS.speak.find(goal => goal * 3600 > props.seconds) ||
              DAILY_GOALS.speak[DAILY_GOALS.speak.length - 1]) * 3600
          }
          formatProgress={formatSeconds}
          progressSecondary
          onClick={() => {
            trackLanguages('contribute', locale);
            history.push(toLocaleRouteBuilder(locale)(URLS.SPEAK));
          }}>
          <LocalizationProvider l10n={l10n}>
            <Localized id="contribute">
              <span />
            </Localized>
          </LocalizationProvider>
        </Skeleton>
      )}
    </>
  );
});

export default withRouter(LocalizationBox);
