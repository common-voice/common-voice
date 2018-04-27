import * as React from 'react';
import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import { trackSharing } from '../../services/tracker';
import URLS from '../../urls';
import ContactModal from '../contact-modal/contact-modal';
import { LocaleLink } from '../locale-helpers';
import {
  ContactIcon,
  FontIcon,
  DiscourseIcon,
  SupportIcon,
  GithubIcon,
} from '../ui/icons';
import Logo from './logo';

import './footer.css';

const SHARE_URL = 'https://voice.mozilla.org/';

interface FooterState {
  showContactModal: boolean;
}

class Footer extends React.PureComponent<LocalizationProps, FooterState> {
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
    const encodedShareText = encodeURIComponent(
      this.props.getString('share-text', { link: SHARE_URL })
    );
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
          <a href="javascript:void(0)" onClick={this.toggleContactModal}>
            <ContactIcon />
            <Localized id="contact">
              <div />
            </Localized>
          </a>
        </div>
        <div id="moz-links">
          <div className="content">
            <Logo reverse />
            <div className="links">
              <p>
                <Localized id="privacy">
                  <LocaleLink to={URLS.PRIVACY} />
                </Localized>
                <Localized id="terms">
                  <LocaleLink to={URLS.TERMS} />
                </Localized>
                <Localized id="cookies">
                  <a
                    target="_blank"
                    href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                  />
                </Localized>
                <Localized id="faq">
                  <LocaleLink to={URLS.FAQ}>FAQ</LocaleLink>
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
                  value={SHARE_URL}
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
                  encodeURIComponent(SHARE_URL)
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackSharing('facebook')}>
                <FontIcon type="facebook" />
              </a>
            </div>
          </div>
          <Localized id="back-top">
            <a
              className="back-top"
              href="javascript:void(0)"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
            />
          </Localized>
        </div>
      </footer>
    );
  }
}

export default withLocalization(Footer);
