const { LocalizationProvider, Localized } = require('fluent-react/compat');
import { RouteComponentProps, withRouter } from 'react-router';
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';
import { InProgressLanguage, LaunchedLanguage } from 'common/language-stats';
import URLS from '../../../urls';
import { createCrossLocaleBundleGenerator } from '../../../services/localization';
import { trackLanguages } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { toLocaleRouteBuilder } from '../../locale-helpers';
import ProgressBar from '../../progress-bar/progress-bar';
import { Hr } from '../../ui/ui';
import GetInvolvedModal from './get-involved-modal';

const SENTENCE_COUNT_TARGET = 5000;
const HOURS_TARGET = 1200;

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
              <React.Fragment>
                {metricLabel}
                <b className="value">{metricValue.toLocaleString()}</b>
              </React.Fragment>
            )}
          </div>
          <Hr />
          <div>
            {loading ? (
              <ContentLoader height={25} />
            ) : (
              <React.Fragment>
                {progressLabel}
                <span className="value">
                  <b>{formatProgress(progress)}</b> /{' '}
                  {formatProgress(progressTotal)}
                </span>
              </React.Fragment>
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

interface PropsFromState {
  globalLocale: Locale.State;
}

type Props = PropsFromState &
  RouteComponentProps<{}> & {
    localeMessages: string[][];
  } & (
    | (InProgressLanguage & { type: 'in-progress' })
    | (LaunchedLanguage & { type: 'launched' }));

interface State {
  showModal: boolean;
}

class LocalizationBox extends React.PureComponent<Props, State> {
  state: State = {
    showModal: false,
  };

  buildBundleGenerator() {
    const { globalLocale, locale, localeMessages } = this.props;

    return (
      localeMessages &&
      createCrossLocaleBundleGenerator(localeMessages, [locale, globalLocale])
    );
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  goToContribute = () => {
    const { history, locale } = this.props;
    trackLanguages('contribute', locale);
    history.push(toLocaleRouteBuilder(locale)(URLS.SPEAK));
  };

  render() {
    const { locale } = this.props;

    const title = (
      <Localized id={locale}>
        <span />
      </Localized>
    );

    return (
      <React.Fragment>
        {this.state.showModal && (
          <LocalizationProvider bundles={this.buildBundleGenerator()}>
            <GetInvolvedModal
              locale={locale}
              onRequestClose={this.toggleModal}
            />
          </LocalizationProvider>
        )}
        {this.props.type === 'in-progress' ? (
          <Skeleton
            title={title}
            metricLabel={
              <Localized id="localized">
                <span />
              </Localized>
            }
            metricValue={this.props.localizedPercentage + '%'}
            progressLabel={
              <Localized id="sentences">
                <span />
              </Localized>
            }
            progress={this.props.sentencesCount}
            progressTotal={SENTENCE_COUNT_TARGET}
            onClick={this.toggleModal}>
            <LocalizationProvider bundles={this.buildBundleGenerator()}>
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
            metricValue={this.props.speakers}
            progressLabel={
              <Localized id="total-hours">
                <span />
              </Localized>
            }
            progress={this.props.seconds}
            progressTotal={HOURS_TARGET * 3600}
            formatProgress={formatSeconds}
            progressSecondary
            onClick={this.goToContribute}>
            <LocalizationProvider bundles={this.buildBundleGenerator()}>
              <Localized id="contribute">
                <span />
              </Localized>
            </LocalizationProvider>
          </Skeleton>
        )}
      </React.Fragment>
    );
  }
}

export default connect<PropsFromState>(({ locale }: StateTree) => ({
  globalLocale: locale,
}))(withRouter(LocalizationBox));
