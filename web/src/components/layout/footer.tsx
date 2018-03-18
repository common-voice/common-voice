import * as React from 'react';
import { Link } from 'react-router-dom';
const { Localized } = require('fluent-react');
import { trackSharing } from '../../services/tracker';
import URLS from '../../urls';
import ContactModal from '../contact-modal/contact-modal';
import {
  ContactIcon,
  FontIcon,
  DiscourseIcon,
  SupportIcon,
  GithubIcon,
} from '../ui/icons';
import Logo from './logo';

const shareURL = 'https://voice.mozilla.org/';
const encodedShareText = encodeURIComponent(
  'Help teach machines how real people speak, donate your voice at ' + shareURL
);

interface FooterState {
  showContactModal: boolean;
}

export default class Footer extends React.Component<
  {
    basePath: string;
  },
  FooterState
> {
  private shareURLInput: HTMLInputElement;

  state: FooterState = {
    showContactModal: false,
  };

  private copyShareURL = () => {
    this.shareURLInput.select();
    document.execCommand('copy');
    trackSharing('link');
  };

  private toggleContactModal = () => {
    this.setState(state => ({ showContactModal: !state.showContactModal }));
  };

  render() {
    const { basePath } = this.props;
    return (
      <footer>
        {this.state.showContactModal && (
          <ContactModal onRequestClose={this.toggleContactModal} />
        )}
        <div id="help-links">
          <Link id="help" to={basePath + URLS.FAQ}>
            <SupportIcon />
            <Localized id="help">
              <div />
            </Localized>
          </Link>
          <div className="divider" />
          <a
            id="contribute"
            target="_blank"
            href="https://github.com/mozilla/voice-web">
            <GithubIcon />
            <div>GitHub</div>
          </a>
          <div className="divider" />
          <a
            id="discourse"
            target="blank"
            href="https://discourse.mozilla-community.org/c/voice">
            <DiscourseIcon />
            <div>Discourse</div>
          </a>
          <div className="divider" />
          <a href="javascript:void(0)" onClick={this.toggleContactModal}>
            <ContactIcon />
            <Localized id="contact">
              <div />
            </Localized>
          </a>
        </div>
        <div id="moz-links">
          <div className="content">
            <Logo reverse to={basePath} />
            <div className="links">
              <p>
                <Localized id="privacy">
                  <Link to={basePath + URLS.PRIVACY} />
                </Localized>
                <Localized id="terms">
                  <Link to={basePath + URLS.TERMS} />
                </Localized>
                <Localized id="cookies">
                  <a
                    target="_blank"
                    href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                  />
                </Localized>
                <Localized id="faq">
                  <Link to={basePath + URLS.FAQ}>FAQ</Link>
                </Localized>
              </p>
              <p>
                <Localized
                  id="content-license-text"
                  licenseLink={
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="https://www.mozilla.org/en-US/foundation/licensing/website-content/"
                    />
                  }>
                  <span />
                </Localized>
              </p>
            </div>
          </div>
          <div id="sharing">
            <Localized id="share-title">
              <h3 />
            </Localized>

            <div className="icons">
              <button id="link-copy" onClick={this.copyShareURL}>
                <input
                  type="text"
                  readOnly
                  value={shareURL}
                  ref={node => (this.shareURLInput = node)}
                />
                <FontIcon type="link" />
              </button>
              <a
                href={
                  'https://twitter.com/intent/tweet?text=' + encodedShareText
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSharing('twitter')}>
                <FontIcon type="twitter" />
              </a>
              <a
                href={
                  'https://www.facebook.com/sharer/sharer.php?u=' +
                  encodeURIComponent(shareURL)
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSharing('facebook')}>
                <FontIcon type="facebook" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
