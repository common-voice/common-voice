import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import ShareButtons from '../share-buttons/share-buttons';
import {
  ContactIcon,
  DiscourseIcon,
  GithubIcon,
  SupportIcon,
} from '../ui/icons';
import { TextButton } from '../ui/ui';
import { LocaleLink, useLocale } from '../locale-helpers';
import Logo from './logo';
import SubscribeNewsletter from './subscribe-newsletter';
import { DiscourseLink, GitHubLink } from '../shared/links';

import './footer.css';

const LocalizedLocaleLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale();
  return (
    <Localized id={id} onClick={() => trackNav(id, locale)}>
      <LocaleLink to={to} />
    </Localized>
  );
};

export default React.memo(() => {
  return (
    <footer>
      <div id="moz-links">
        <div className="logo-container">
          <h1>
            <strong>Samrómur</strong>
          </h1>
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
