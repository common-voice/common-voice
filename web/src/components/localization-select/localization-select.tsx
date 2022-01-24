import * as React from 'react';

import { LocalizedGetAttribute } from '../locale-helpers';
import { LOCALES_WITH_NAMES } from '../../services/localization';
import { LabeledSelect } from '../ui/ui';

import './localization-select.css';

interface Props {
  locale?: string;
  onLocaleChange?: (props: any) => any;
}

const LocalizationSelect = ({ locale, onLocaleChange }: Props) => {
  // don't show select if we dont have multiple locales
  if (LOCALES_WITH_NAMES.length <= 1) {
    return null;
  }

  return (
    <LocalizedGetAttribute id="localization-select" attribute="label">
      {(label: string) => (
        <LabeledSelect
          className="localization-select"
          value={locale}
          label={label}
          isLabelVisuallyHidden={true}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (onLocaleChange) {
              onLocaleChange(event.target.value);
            }
          }}>
          {LOCALES_WITH_NAMES.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </LabeledSelect>
      )}
    </LocalizedGetAttribute>
  );
};

export default LocalizationSelect;
