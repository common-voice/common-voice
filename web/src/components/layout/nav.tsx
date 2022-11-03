import { Localized } from '@fluent/react';
import * as React from 'react';
import { trackNav, getTrackClass } from '../../services/tracker';
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
      <LocaleNavLink
        className={getTrackClass('fs', id)}
        to={to}
        exact
        onClick={() => trackNav(id, locale)}
      />
    </Localized>
  );
};

export default function Nav({ children, ...props }: { [key: string]: any }) {
  return (
    <nav {...props} className="nav-list">
      <div className="nav-links">
        <ContributableLocaleLock>
          <LocalizedNavLink id="contribute" to={URLS.SPEAK} />
        </ContributableLocaleLock>
        <LocalizedNavLink id="datasets" to={URLS.DATASETS} />
        <LocalizedNavLink id="languages" to={URLS.LANGUAGES} />
        <LocalizedNavLink id="partner" to={URLS.PARTNER} />
        <LocalizedNavLink id="about" to={URLS.ABOUT} />
      </div>
      {children}
    </nav>
  );
}
