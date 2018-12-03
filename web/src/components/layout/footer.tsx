import * as React from 'react';
import { useState } from 'react';
import { Localized } from 'fluent-react/compat';
import { trackGlobal, trackNav } from '../../services/tracker';
import URLS from '../../urls';
import ContactModal from '../contact-modal/contact-modal';
import ShareButtons from '../share-buttons/share-buttons';
import {
  ContactIcon,
  DiscourseIcon,
  GithubIcon,
  SupportIcon,
} from '../ui/icons';
import { TextButton } from '../ui/ui';
import {
  localeConnector,
  LocaleLink,
  LocalePropsFromState,
} from '../locale-helpers';
import Logo from './logo';
import SubscribeNewsletter from './subscribe-newsletter';

import './footer.css';

const LocalizedLocaleLink = localeConnector(
  ({ id, locale, to }: { id: string; to: string } & LocalePropsFromState) => (
    <Localized id={id} onClick={() => trackNav(id, locale)}>
      <LocaleLink to={to} />
    </Localized>
  )
);

const Footer = React.memo(({ locale }: LocalePropsFromState) => {
  const [showContactModal, setShowContactModal] = useState(false);
  return (
    <footer>
      {showContactModal && (
        <ContactModal onRequestClose={() => setShowContactModal(false)} />
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
        <TextButton
          onClick={() => {
            trackGlobal('contact', locale);
            setShowContactModal(true);
          }}>
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

        <div id="email-subscription">
          <SubscribeNewsletter />
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
});

export default localeConnector(Footer);
