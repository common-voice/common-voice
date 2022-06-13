import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  ReactLocalization,
  Localized,
  LocalizationProvider,
} from '@fluent/react';

import URLS from '../../../../urls';
import { toLocaleRouteBuilder } from '../../../locale-helpers';

import styles from './cta.module.css';

interface LanguageCardCTAProps {
  type: 'launched' | 'in-progress';
  locale: string;
  l10n: ReactLocalization;
  onClick: () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const LanguageCardCTA = ({
  type,
  locale,
  l10n,
  onClick,
}: LanguageCardCTAProps) => {
  if (type === 'launched') {
    return (
      <Link
        className={styles.cta}
        to={toLocaleRouteBuilder(locale)(URLS.SPEAK)}>
        <LocalizationProvider l10n={l10n}>
          <Localized id="contribute" />
        </LocalizationProvider>
      </Link>
    );
  }

  return (
    <button className={styles.cta} onClick={onClick}>
      <LocalizationProvider l10n={l10n}>
        <Localized id="get-involved-button" />
      </LocalizationProvider>
    </button>
  );
};

export default LanguageCardCTA;
