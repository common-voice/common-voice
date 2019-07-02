import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import {
  ContributableLocaleLock,
  LocaleNavLink,
  useLocale,
} from '../locale-helpers';

import './nav.css';

const LocalizedNavLink = ({ id, to }: { id: string; to: string }) => {
  const [locale] = useLocale();
  return (
    <Localized id={id}>
      <LocaleNavLink to={to} exact onClick={() => trackNav(id, locale)} />
    </Localized>
  );
};

export default ({ children, ...props }: { [key: string]: any }) => (
  <nav {...props} className="nav-list">
    <div className="nav-links">
      <LocalizedNavLink id="home" to="" />
      <LocalizedNavLink id="datasets" to={URLS.DATASETS} />
      <LocalizedNavLink id="languages" to={URLS.LANGUAGES} />
      <LocalizedNavLink id="about" to={URLS.ABOUT} />
    </div>
    {children}
  </nav>
);
