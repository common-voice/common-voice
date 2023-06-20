import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { LanguageStatistics } from 'common';
import { createCrossLocalization } from '../../../../services/localization';
import { useAvailableLocales, useLocale } from '../../../locale-helpers';
import { ModalOptions } from '../languages';

import LanguageCardCTA from './cta';
import LanguageCardData from './data';

import styles from './language-card.module.css';

interface LanguageCardProps {
  type: 'launched' | 'in-progress';
  localeMessages: string[][];
  language: LanguageStatistics;
  setModalOptions?: ({ locale, l10n }: ModalOptions) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const LanguageCard = ({
  type,
  localeMessages,
  language,
  setModalOptions,
}: LanguageCardProps) => {
  const [globalLocale] = useLocale();
  const availableLocales = useAvailableLocales();

  const l10n = createCrossLocalization(
    localeMessages,
    [language.locale, globalLocale],
    availableLocales
  );

  return (
    <div className={styles.LanguageCard}>
      <div className={styles.LanguageCardContent}>
        <h3 className={styles.LanguageCardHeading}>
          <Localized id={language.locale} />
        </h3>

        <LanguageCardData type={type} language={language} />
      </div>

      <LanguageCardCTA
        type={type}
        locale={language.locale}
        l10n={l10n}
        onClick={() => {
          if (type === 'in-progress') {
            // show modal
            setModalOptions({ locale: language.locale, l10n });
          }
        }}
      />
    </div>
  );
};

export default LanguageCard;
