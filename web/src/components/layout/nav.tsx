import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import URLS from '../../urls';
import { isProduction } from '../../utility';
import { ContributableLocaleLock, LocaleNavLink } from '../locale-helpers';

import './nav.css';

export default ({ children, ...props }: { [key: string]: any }) => (
  <nav {...props} className="nav-list">
    <div className="nav-links">
      <ContributableLocaleLock>
        <Localized id="contribute">
          <LocaleNavLink to={URLS.SPEAK} exact />
        </Localized>
      </ContributableLocaleLock>
      <Localized id="datasets">
        <LocaleNavLink to={URLS.DATASETS} exact />
      </Localized>
      <Localized id="languages">
        <LocaleNavLink to={URLS.LANGUAGES} exact />
      </Localized>
    </div>
    {children}
  </nav>
);
