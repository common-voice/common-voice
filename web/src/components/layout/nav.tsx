import { Localized } from 'fluent-react';
import * as React from 'react';
import { isProduction } from '../../utility';
import URLS from '../../urls';
import { LocaleNavLink } from '../locale-helpers';

import './nav.css';

export default ({ children, ...props }: { [key: string]: any }) => (
  <nav {...props} className="nav-list">
    <Localized id="speak">
      <LocaleNavLink to={URLS.RECORD} exact />
    </Localized>
    <Localized id="datasets">
      <LocaleNavLink to={URLS.DATA} exact />
    </Localized>
    {!isProduction() && (
      <Localized id="languages">
        <LocaleNavLink to={URLS.LANGUAGES} exact />
      </Localized>
    )}
    <Localized id="profile">
      <LocaleNavLink to={URLS.PROFILE} exact />
    </Localized>
    {children}
  </nav>
);
