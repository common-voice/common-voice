import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
const { LocalizationProvider, Localized } = require('fluent-react');
import URLS from '../../../urls';
import {
  ContributableLocaleLock,
  localeConnector,
  LocalePropsFromState,
} from '../../locale-helpers';
import Validator from '../../validator';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { RecordIcon } from '../../ui/icons';
import { CardAction, Hr } from '../../ui/ui';
import GetInvolvedModal from '../languages/get-involved-modal';
import ProjectStatus from './project-status';
import {
  createCrossLocaleMessagesGenerator,
  getNativeNameWithFallback,
} from '../../../services/localization';
import { connect } from 'react-redux';
import StateTree from '../../../stores/tree';
import API from '../../../services/api';

interface PropsFromState {
  api: API;
}

type Props = RouteComponentProps<any> & LocalePropsFromState & PropsFromState;

interface State {
  messagesGenerator: any;
  showGetInvolvedModal: boolean;
  showLanguageRequestModal: boolean;
  showWallOfText: boolean;
}

class HomePage extends React.Component<Props, State> {
  state: State = {
    messagesGenerator: null,
    showGetInvolvedModal: false,
    showLanguageRequestModal: false,
    showWallOfText: false,
  };

  toggleGetInvolvedModal = () => {
    this.setState({ showGetInvolvedModal: !this.state.showGetInvolvedModal });
  };

  async componentDidMount() {
    await this.updateMessagesGenerator(this.props);
  }

  async componentWillReceiveProps(nextProps: Props) {
    await this.updateMessagesGenerator(nextProps);
  }

  async updateMessagesGenerator({ api, locale }: Props) {
    if (this.state.messagesGenerator && locale === this.props.locale) return;
    this.setState({
      messagesGenerator: createCrossLocaleMessagesGenerator(
        await api.fetchCrossLocaleMessages(),
        [locale]
      ),
    });
  }

  render() {
    const { locale } = this.props;
    const {
      messagesGenerator,
      showGetInvolvedModal,
      showWallOfText,
    } = this.state;
    return (
      <div id="home-container">
        {this.state.showLanguageRequestModal && (
          <RequestLanguageModal
            onRequestClose={() =>
              this.setState({ showLanguageRequestModal: false })
            }
          />
        )}
        <Localized id="home-title">
          <h2 id="home-title" />
        </Localized>
        <div
          id="wall-of-text"
          className={showWallOfText ? 'show-more-text' : ''}>
          <ContributableLocaleLock
            render={({ isContributable }) =>
              isContributable ? (
                <CardAction id="contribute-button" to={URLS.RECORD}>
                  <div>
                    <RecordIcon />
                  </div>
                  <Localized id="home-cta">
                    <span />
                  </Localized>
                </CardAction>
              ) : (
                messagesGenerator && (
                  <LocalizationProvider messages={messagesGenerator}>
                    <React.Fragment>
                      <Localized id="get-involved-button">
                        <CardAction
                          id="contribute-button"
                          onClick={this.toggleGetInvolvedModal}
                        />
                      </Localized>
                      {showGetInvolvedModal && (
                        <GetInvolvedModal
                          locale={{
                            code: locale,
                            name: getNativeNameWithFallback(locale),
                          }}
                          onRequestClose={this.toggleGetInvolvedModal}
                        />
                      )}
                    </React.Fragment>
                  </LocalizationProvider>
                )
              )
            }
          />

          <Localized id="wall-of-text-start">
            <p />
          </Localized>

          <Localized id="wall-of-text-more-mobile">
            <p className="more-text-mobile" />
          </Localized>

          <Localized id="wall-of-text-more-desktop" lineBreak={<br />}>
            <p className="more-text-desktop" />
          </Localized>

          {!showWallOfText && (
            <Localized id="show-wall-of-text">
              <a
                id="show-more-button"
                onClick={() => this.setState({ showWallOfText: true })}
              />
            </Localized>
          )}
        </div>

        <ContributableLocaleLock>
          <Hr />

          <div>
            <Localized id="help-us-title">
              <h1 />
            </Localized>
            <Localized id="help-us-explain">
              <div id="help-explain" />
            </Localized>

            <Validator />
          </div>
        </ContributableLocaleLock>

        <br />
        <Hr />
        <br />

        <ProjectStatus
          onRequestLanguage={() =>
            this.setState({ showLanguageRequestModal: true })
          }
        />

        <br />
      </div>
    );
  }
}
export default withRouter(
  connect<PropsFromState>(({ api }: StateTree) => ({
    api,
  }))(localeConnector(HomePage))
);
