import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { trackNav } from '../../services/tracker';
import URLS from '../../urls';
import {
  ContributableLocaleLock,
  localeConnector,
  LocaleNavLink,
  LocalePropsFromState,
} from '../locale-helpers';

import './nav.css';

const LocalizedNavLink = localeConnector(
  ({ id, locale, to }: { id: string; to: string } & LocalePropsFromState) => (
    <Localized id={id}>
      <LocaleNavLink to={to} exact onClick={() => trackNav(id, locale)} />
    </Localized>
  )
);

export default ({ children, ...props }: { [key: string]: any }) => (
  <nav {...props} className="nav-list">
    <div className="nav-links">
      <ContributableLocaleLock>
        <LocalizedNavLink id="contribute" to={URLS.SPEAK} />
      </ContributableLocaleLock>
      <LocalizedNavLink id="datasets" to={URLS.DATASETS} />
      <LocalizedNavLink id="languages" to={URLS.LANGUAGES} />
      <LocalizedNavLink id="about" to={URLS.ABOUT} />
    </div>
    {children}
  </nav>
);
