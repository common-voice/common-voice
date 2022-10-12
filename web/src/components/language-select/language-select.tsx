export const ALL_LOCALES = 'all-locales';

import * as React from 'react';
import {
  LocalizedGetAttribute,
  useAvailableLocales,
  useLocale,
} from '../locale-helpers';
import { LabeledSelect } from '../ui/ui';

import '../localization-select/localization-select.css';
import { Localized } from '@fluent/react';

interface Props {
  locale?: string;
  onChange?: (props: string) => void;
  value: string;
  includesAll?: boolean;
}

const LanguageSelect = ({ locale, onChange, value, includesAll }: Props) => {
  const [clientLocale] = useLocale();
  let languages: string[] = [];
  const localesWithNames = useAvailableLocales();
  const sortedLocales = localesWithNames.sort((a, b) =>
    a.localeCompare(b, clientLocale)
  );

  languages = sortedLocales;

  if (includesAll) {
    languages = [ALL_LOCALES, ...languages];
  }
  // don't show select if we dont have multiple locales
  if (localesWithNames.length <= 1) {
    return null;
  }

  return (
    <LocalizedGetAttribute id="localization-select" attribute="label">
      {(label: string) => (
        <LabeledSelect
          style={{ height: 40, paddingTop: '5px', paddingBottom: '5px' }}
          className="localization-select"
          value={locale}
          label={label}
          isLabelVisuallyHidden
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();
            event.stopPropagation();

            if (onChange) {
              onChange(event.target.value);
            }
          }}>
          {languages.map(code => (
            <Localized key={code} id={code}>
              <option key={code} value={code}>
                {code}
              </option>
            </Localized>
          ))}
        </LabeledSelect>
      )}
    </LocalizedGetAttribute>
  );
};

LanguageSelect.defaultProps = {
  includesAll: true,
};

export default LanguageSelect;
