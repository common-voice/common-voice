const { LocalizationProvider, Localized } = require('fluent-react');
import * as React from 'react';
import { connect } from 'react-redux';
import ProgressBar from '../../progress-bar/progress-bar';
import { createCrossLocaleMessagesGenerator } from '../../../services/localization';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { Hr } from '../../ui/ui';
import GetInvolvedModal from './get-involved-modal';

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
      <li className="language">
        <div className="info">
          <Localized id={locale.code}>
            <h2 />
          </Localized>
          <div className="numbers">
            <div>
              <Localized id="language-speakers">
                <span />
              </Localized>
              <b>{locale.population.toLocaleString()}</b>
            </div>
            <Hr />
            <div>
              <Localized id="language-total-progress">
                <span />
              </Localized>
              <b>{Math.round(progress * 100)}%</b>
            </div>
            <ProgressBar progress={progress} />
          </div>
        </div>
        {showCTA && (
          <button onClick={this.toggleModal}>
            <LocalizationProvider messages={messagesGenerator}>
              <React.Fragment>
                <Localized id="get-involved-button">
                  <span />
                </Localized>
                {this.state.showModal && (
                  <GetInvolvedModal
                    locale={locale}
                    onRequestClose={this.toggleModal}
                  />
                )}
              </React.Fragment>
            </LocalizationProvider>
          </button>
        )}
      </li>
    );
  }
}

export default connect<PropsFromState>(({ locale }: StateTree) => ({
  globalLocale: locale,
}))(LocalizationBox);
