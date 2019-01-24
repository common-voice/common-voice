import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { trackGlobal, trackNav } from '../../services/tracker';
import URLS from '../../urls';
import ContactModal from '../contact-modal/contact-modal';
import ShareButtons from '../share-buttons/share-buttons';
import {
  localeConnector,
  LocaleLink,
  LocalePropsFromState,
} from '../locale-helpers';
import {
  ContactIcon,
  DiscourseIcon,
  SupportIcon,
  GithubIcon,
} from '../ui/icons';
import { TextButton } from '../ui/ui';
import Logo from './logo';

import './footer.css';

const LocalizedLocaleLink = localeConnector(
  ({ id, locale, to }: { id: string; to: string } & LocalePropsFromState) => (
    <Localized id={id} onClick={() => trackNav(id, locale)}>
      <LocaleLink to={to} />
    </Localized>
  )
);

interface FooterState {
  showContactModal: boolean;
}

class Footer extends React.PureComponent<LocalePropsFromState, FooterState> {
  state: FooterState = {
    showContactModal: false,
  };

  private toggleContactModal = () => {
    trackGlobal('contact', this.props.locale);
    this.setState(state => ({ showContactModal: !state.showContactModal }));
  };

  render() {
    const { locale } = this.props;
    return (
      <footer>
        {this.state.showContactModal && (
          <ContactModal onRequestClose={this.toggleContactModal} />
        )}
        <div id="help-links">
          <LocaleLink id="help" to={URLS.FAQ}>
            <SupportIcon />
            <Localized id="help" onClick={() => trackNav('help', locale)}>
              <div />
            </Localized>
          </LocaleLink>
          <div className="divider" />
          <a
            id="contribute"
            target="_blank"
            href="https://github.com/mozilla/voice-web"
            onClick={() => trackGlobal('github', locale)}>
            <GithubIcon />
            <div>GitHub</div>
          </a>
          <div className="divider" />
          <a
            id="discourse"
            target="blank"
            href="https://discourse.mozilla-community.org/c/voice"
            onClick={() => trackGlobal('discourse', locale)}>
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
              <LocalizedLocaleLink id="privacy" to={URLS.PRIVACY} />
              <LocalizedLocaleLink id="terms" to={URLS.TERMS} />
            </div>
            <div>
              <Localized id="cookies">
                <a
                  target="_blank"
                  href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                />
              </Localized>
              <LocalizedLocaleLink id="faq" to={URLS.FAQ} />
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
                document.getElementById('scroller').scrollTop = 0;
              }}
            />
          </Localized>
        </div>
      </footer>
    );
  }
}

export default localeConnector(Footer);
