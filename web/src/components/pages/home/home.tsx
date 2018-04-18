import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Localized } from 'fluent-react';
import Validator from '../../validator';
import RequestLanguageModal from '../../request-language-modal/request-language-modal';
import { RecordIcon } from '../../ui/icons';
import { CardAction, Hr } from '../../ui/ui';
import ProjectStatus from './project-status';

interface State {
  showLanguageRequestModal: boolean;
  showWallOfText: boolean;
}

class HomePage extends React.Component<RouteComponentProps<any>, State> {
  state = {
    showLanguageRequestModal: false,
    showWallOfText: false,
  };

  render() {
    const { showWallOfText } = this.state;
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
          <CardAction id="contribute-button" to="/record">
            <div>
              <RecordIcon />
            </div>
            <Localized id="home-cta">
              <span />
            </Localized>
          </CardAction>

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
export default withRouter(HomePage);
