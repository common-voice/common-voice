import { Localized } from 'fluent-react';
import * as React from 'react';
import URLS from '../../urls';
import { ContributableLocaleLock, LocaleNavLink } from '../locale-helpers';

import './nav.css';

export default ({ children, ...props }: { [key: string]: any }) => (
  <nav {...props} className="nav-list">
    <ContributableLocaleLock>
      <Localized id="speak">
        <LocaleNavLink to={URLS.RECORD} exact />
      </Localized>
    </ContributableLocaleLock>
    <Localized id="datasets">
      <LocaleNavLink to={URLS.DATA} exact />
    </Localized>
    <Localized id="languages">
      <LocaleNavLink to={URLS.LANGUAGES} exact />
    </Localized>
    <Localized id="profile">
      <LocaleNavLink to={URLS.PROFILE} exact />
    </Localized>
    {children}
  </nav>
);
