import * as React from 'react';
import { Localized } from '@fluent/react';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import ShareButtons from '../share-buttons/share-buttons';
import { ContactIcon, DiscourseIcon, SupportIcon } from '../ui/icons';
import { TextButton } from '../ui/ui';
import { LocaleLink, useLocale } from '../locale-helpers';
import Logo from './logo';
import SubscribeNewsletter from './subscribe-newsletter';
import { ContactLink, DiscourseLink, GitHubLink } from '../shared/links';

import './footer.css';

const LocalizedLocaleLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale();
  return (
    <Localized id={id}>
      <LocaleLink to={to} onClick={() => trackNav(id, locale)} />
    </Localized>
  );
};

export default React.memo(() => {
  const [locale] = useLocale();
  return (
    <footer>
      <div id="help-links">
        <LocaleLink to={URLS.FAQ} onClick={() => trackNav('faq', locale)}>
          <SupportIcon />
          <Localized id="faq">
            <div />
          </Localized>
        </LocaleLink>
        <div className="divider" />
        <DiscourseLink id="discourse">
          <DiscourseIcon />
          <div>Discourse</div>
        </DiscourseLink>
        <div className="divider" />
        <ContactLink>
          <ContactIcon />
          <Localized id="contact">
            <div />
          </Localized>
        </ContactLink>
      </div>
      <div id="moz-links">
        <div className="logo-container">
          <Logo isReverse />
          <p className="license">
            <Localized
              id="content-license-text"
              elems={{
                licenseLink: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.mozilla.org/en-US/foundation/licensing/website-content/"
                  />
                ),
              }}>
              <span />
            </Localized>
          </p>
        </div>
        <div className="divider-bottom" />
        <div className="links">
          <div>
            <LocalizedLocaleLink id="privacy" to={URLS.PRIVACY} />
            <LocalizedLocaleLink id="terms" to={URLS.TERMS} />
            <Localized id="cookies">
              <a
                target="_blank"
                href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                rel="noopener noreferrer"
              />
            </Localized>
          </div>
          <div className="divider-vertical" />
          <div>
            <LocalizedLocaleLink id="faq" to={URLS.FAQ} />
            <GitHubLink>GitHub</GitHubLink>
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
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </Localized>
      </div>
    </footer>
  );
});
