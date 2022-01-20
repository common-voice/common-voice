import * as React from 'react';

import { LOCALES, LOCALES_WITH_NAMES } from '../../services/localization';
import { LabeledSelect } from '../ui/ui';

import './localization-select.css';

interface Props {
  locale?: string;
  onLocaleChange: (props: any) => any;
}

const LocalizationSelect = ({ locale, onLocaleChange }: Props) => {
  // don't show select if we dont have multiple locales
  if (LOCALES.length <= 1) {
    return null;
  }

  return (
    <LabeledSelect
      className="localization-select"
      value={locale}
      label="Change language/localization"
      isLabelVisuallyHidden={true}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        onLocaleChange(event.target.value)
      }>
      {LOCALES_WITH_NAMES.map(({ code, name }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </LabeledSelect>
  );
};

export default LocalizationSelect;
