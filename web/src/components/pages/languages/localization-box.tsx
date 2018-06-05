import { toLocaleRouteBuilder } from '../../locale-helpers';

const { LocalizationProvider, Localized } = require('fluent-react');
import { RouteComponentProps, withRouter } from 'react-router';
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';
import URLS from '../../../urls';
import { createCrossLocaleMessagesGenerator } from '../../../services/localization';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import ProgressBar from '../../progress-bar/progress-bar';
import { Hr } from '../../ui/ui';
import GetInvolvedModal from './get-involved-modal';

function Skeleton({
  loading,
  title,
  population,
  progress,
  children,
  onClick,
}: {
  loading?: boolean;
  title?: React.ReactNode;
  population?: React.ReactNode;
  progress?: number;
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
                <Localized id="language-speakers">
                  <span />
                </Localized>
                <b>{population}</b>
              </React.Fragment>
            )}
          </div>
          <Hr />
          <div>
            {loading ? (
              <ContentLoader height={25} />
            ) : (
              <React.Fragment>
                <Localized
                  id={
                    progress < 1
                      ? 'language-meter-in-progress'
                      : 'language-section-launched'
                  }>
                  <span />
                </Localized>
                <b>{Math.round(progress * 100)}%</b>
              </React.Fragment>
            )}
          </div>
          {loading ? (
            <ContentLoader height={25} />
          ) : (
            <ProgressBar progress={progress} />
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

interface Locale {
  code?: string;
  name: string;
  population: number;
}

interface PropsFromState {
  globalLocale: Locale.State;
}

interface Props extends PropsFromState, RouteComponentProps<any> {
  localization: {
    locale: Locale;
    progress: number;
  };
  localeMessages: string[][];
  type: 'in-progress' | 'launched';
}

interface State {
  showModal: boolean;
}

class LocalizationBox extends React.PureComponent<Props, State> {
  state: State = {
    showModal: false,
  };

  buildMessagesGenerator() {
    const { globalLocale, localization, localeMessages } = this.props;

    return (
      localeMessages &&
      createCrossLocaleMessagesGenerator(localeMessages, [
        localization.locale.code,
        globalLocale,
      ])
    );
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  goToContribute = () => {
    const { history, localization } = this.props;
    history.push(toLocaleRouteBuilder(localization.locale.code)(URLS.RECORD));
  };

  render() {
    const { localization, type } = this.props;
    const isInProgress = type == 'in-progress';

    return (
      <React.Fragment>
        {this.state.showModal && (
          <LocalizationProvider messages={this.buildMessagesGenerator()}>
            <GetInvolvedModal
              locale={localization.locale}
              onRequestClose={this.toggleModal}
            />
          </LocalizationProvider>
        )}
        <Skeleton
          title={
            <Localized id={localization.locale.code}>
              <span />
            </Localized>
          }
          population={localization.locale.population.toLocaleString()}
          progress={localization.progress + (isInProgress ? 0 : 0.5)}
          onClick={isInProgress ? this.toggleModal : this.goToContribute}>
          <LocalizationProvider messages={this.buildMessagesGenerator()}>
            {isInProgress ? (
              <Localized id="get-involved-button">
                <span />
              </Localized>
            ) : (
              <Localized id="contribute">
                <span />
              </Localized>
            )}
          </LocalizationProvider>
        </Skeleton>
      </React.Fragment>
    );
  }
}

export default withRouter(
  connect<PropsFromState>(({ locale }: StateTree) => ({
    globalLocale: locale,
  }))(LocalizationBox)
);
