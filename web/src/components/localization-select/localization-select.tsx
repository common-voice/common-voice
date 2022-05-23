import * as React from 'react';

import {
  LocalizedGetAttribute,
  useNativeNameAvailableLocales,
} from '../locale-helpers';
import { LabeledSelect } from '../ui/ui';

import './localization-select.css';

interface Props {
  locale?: string;
  onLocaleChange?: (props: string) => void;
}

const LocalizationSelect = ({ locale, onLocaleChange }: Props) => {
  const localesWithNames = useNativeNameAvailableLocales();

  // don't show select if we dont have multiple locales
  if (localesWithNames.length <= 1) {
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
          {localesWithNames.map(({ code, name }) => (
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
