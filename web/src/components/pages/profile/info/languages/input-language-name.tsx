import * as React from 'react';
import { Localized } from '@fluent/react';

import { LabeledSelect } from '../../../../ui/ui';
import { useContributableNativeNames } from '../../../../locale-helpers';
import { UserLanguage } from 'common';
import { AccentsAll } from './languages';

interface InputLanguageNameProps {
  locale: string;
  accentsAll: AccentsAll;
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
}

const InputLanguageName = ({
  locale,
  accentsAll,
  userLanguages,
  setUserLanguages,
}: InputLanguageNameProps) => {
  const nativeNames = useContributableNativeNames();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { value } = event.target;

    const newLanguages = userLanguages.slice();
    const languageIndex = newLanguages.findIndex(language => {
      return language.locale === locale;
    });

    newLanguages[languageIndex] = {
      locale: value,
      accents: accentsAll[value] ? [accentsAll[value]?.default] : [],
    } as UserLanguage;

    if (!value) {
      newLanguages.splice(languageIndex, 1);
    }

    const uniqueNewLanguages = newLanguages.filter(({ locale }, index) => {
      const isCurrentLanguage = index === languageIndex;
      const anyOtherLanguage = locale !== value;
      return isCurrentLanguage || anyOtherLanguage;
    });

    setUserLanguages(uniqueNewLanguages);
  };

  return (
    <Localized id="profile-form-language" attrs={{ label: true }}>
      <LabeledSelect value={locale} onChange={handleChange}>
        <option value="" />
        {Object.entries(nativeNames).map(([locale, name]) => (
          <option key={locale} value={locale}>
            {name}
          </option>
        ))}
      </LabeledSelect>
    </Localized>
  );
};

export default InputLanguageName;
