const { LocalizationProvider, Localized } = require('fluent-react');
import * as React from 'react';
import { connect } from 'react-redux';
import ProgressBar from '../../progress-bar/progress-bar';
import API from '../../../services/api';
import { createCrossLocaleMessagesGenerator } from '../../../services/localization';
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

class LocalizationBox extends React.Component<Props, State> {
  state: State = {
    messagesGenerator: null,
    showModal: false,
  };

  async componentDidMount() {
    const { api, locale } = this.props;
    this.setState({
      messagesGenerator: await createCrossLocaleMessagesGenerator(
        api,
        locale.code
      ),
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

export default connect<PropsFromState>(({ api }: StateTree) => ({ api }))(
  LocalizationBox
);
