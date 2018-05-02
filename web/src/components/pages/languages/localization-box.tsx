const { LocalizationProvider, Localized } = require('fluent-react');
import * as React from 'react';
import ContentLoader from 'react-content-loader';
import { connect } from 'react-redux';
import ProgressBar from '../../progress-bar/progress-bar';
import { createCrossLocaleMessagesGenerator } from '../../../services/localization';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
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
                <Localized id="language-total-progress">
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

interface Props extends PropsFromState {
  locale: Locale;
  localeMessages: string[][];
  progress: number;
  showCTA?: boolean;
}

interface State {
  showModal: boolean;
}

class LocalizationBox extends React.PureComponent<Props, State> {
  state: State = {
    showModal: false,
  };

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    const {
      globalLocale,
      locale,
      localeMessages,
      progress,
      showCTA,
    } = this.props;

    const messagesGenerator =
      localeMessages &&
      createCrossLocaleMessagesGenerator(localeMessages, [
        locale.code,
        globalLocale,
      ]);

    return (
      <React.Fragment>
        {this.state.showModal && (
          <LocalizationProvider messages={messagesGenerator}>
            <GetInvolvedModal
              locale={locale}
              onRequestClose={this.toggleModal}
            />
          </LocalizationProvider>
        )}
        <Skeleton
          title={
            <Localized id={locale.code}>
              <span />
            </Localized>
          }
          population={locale.population.toLocaleString()}
          progress={progress}
          onClick={this.toggleModal}>
          {showCTA && (
            <LocalizationProvider messages={messagesGenerator}>
              <Localized id="get-involved-button">
                <span />
              </Localized>
            </LocalizationProvider>
          )}
        </Skeleton>
      </React.Fragment>
    );
  }
}

export default connect<PropsFromState>(({ locale }: StateTree) => ({
  globalLocale: locale,
}))(LocalizationBox);
