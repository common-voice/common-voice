import * as React from 'react';
import { Localized } from 'fluent-react';
import URLS from '../../urls';
import ContactModal from '../contact-modal/contact-modal';
import ShareButtons from '../share-buttons/share-buttons';
import { LocaleLink } from '../locale-helpers';
import {
  ContactIcon,
  DiscourseIcon,
  SupportIcon,
  GithubIcon,
} from '../ui/icons';
import { TextButton } from '../ui/ui';
import Logo from './logo';

import './footer.css';

interface FooterState {
  showContactModal: boolean;
}

class Footer extends React.PureComponent<{}, FooterState> {
  private shareURLInput: HTMLInputElement;

  state: FooterState = {
    showContactModal: false,
  };

  private toggleContactModal = () => {
    this.setState(state => ({ showContactModal: !state.showContactModal }));
  };

  render() {
    return (
      <footer>
        {this.state.showContactModal && (
          <ContactModal onRequestClose={this.toggleContactModal} />
        )}
        <div id="help-links">
          <LocaleLink id="help" to={URLS.FAQ}>
            <SupportIcon />
            <Localized id="help">
              <div />
            </Localized>
          </LocaleLink>
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
          <TextButton onClick={this.toggleContactModal}>
            <ContactIcon />
            <Localized id="contact">
              <div />
            </Localized>
          </TextButton>
        </div>
        <div id="moz-links">
          <div className="logo-container">
            <Logo reverse />
            <p className="license">
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
          <div className="links">
            <div>
              <Localized id="privacy">
                <LocaleLink to={URLS.PRIVACY} />
              </Localized>
              <Localized id="terms">
                <LocaleLink to={URLS.TERMS} />
              </Localized>
            </div>
            <div>
              <Localized id="cookies">
                <a
                  target="_blank"
                  href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                />
              </Localized>
              <Localized id="faq">
                <LocaleLink to={URLS.FAQ}>FAQ</LocaleLink>
              </Localized>
            </div>
          </div>
          <div id="sharing">
            <Localized id="share-title">
              <span className="title" />
            </Localized>

            <div className="icons">
              <ShareButtons />
            </div>
          </div>
          <Localized id="back-top">
            <TextButton
              className="back-top"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }}
            />
          </Localized>
        </div>
      </footer>
    );
  }
}

export default Footer;
