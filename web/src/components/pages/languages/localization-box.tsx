const { LocalizationProvider, Localized } = require('fluent-react');
import * as React from 'react';
import { connect } from 'react-redux';
import ProgressBar from '../../progress-bar/progress-bar';
import API from '../../../services/api';
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
  api: API;
  globalLocale: Locale.State;
}

interface Props extends PropsFromState {
  locale: Locale;
  progress: number;
  showCTA?: boolean;
}

interface State {
  messagesGenerator: any;
  showModal: boolean;
}

class LocalizationBox extends React.PureComponent<Props, State> {
  state: State = {
    messagesGenerator: null,
    showModal: false,
  };

  async componentDidMount() {
    await this.updateMessagesGenerator();
  }

  async componentDidUpdate() {
    await this.updateMessagesGenerator();
  }

  async updateMessagesGenerator() {
    const { api, globalLocale, locale } = this.props;
    if (this.state.messagesGenerator) return;
    this.setState({
      messagesGenerator: await createCrossLocaleMessagesGenerator(api, [
        locale.code,
        globalLocale,
      ]),
    });
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal });

  render() {
    const { locale, progress, showCTA } = this.props;
    const { messagesGenerator, showModal } = this.state;

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
        {showCTA &&
          messagesGenerator && (
            <LocalizationProvider messages={messagesGenerator}>
              <React.Fragment>
                <Localized id="get-involved-button">
                  <button onClick={this.toggleModal} />
                </Localized>
                {showModal && (
                  <GetInvolvedModal
                    locale={locale}
                    onRequestClose={this.toggleModal}
                  />
                )}
              </React.Fragment>
            </LocalizationProvider>
          )}
      </li>
    );
  }
}

export default connect<PropsFromState>(({ api, locale }: StateTree) => ({
  api,
  globalLocale: locale,
}))(LocalizationBox);
