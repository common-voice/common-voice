import * as React from 'react';
import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';

import { useNativeLocaleNames } from '../../../../locale-helpers';
import { LabeledSelect } from '../../../../ui/ui';
import { UserLanguage } from 'common';
import { VariantsAll } from './languages';

const DEFAULT_OPTION_VALUE = '';
interface InputLanguageVariantProps {
  locale: string;
  variantsAll: VariantsAll;
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
}

const InputLanguageVariant = ({
  locale,
  variantsAll,
  userLanguages,
  setUserLanguages,
  getString: getLocalizedString,
}: InputLanguageVariantProps & WithLocalizationProps) => {
  const nativeNames = useNativeLocaleNames();
  const variants = variantsAll[locale];

  const getUserLanguageVariant = () => {
    const userLanguage = userLanguages.find(language => {
      return language.locale === locale;
    });

    if (!userLanguage?.variant) {
      return DEFAULT_OPTION_VALUE;
    }

    return userLanguage.variant.id;
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { value } = event.target;

    const newLanguages = userLanguages.slice();
    const languageIndex = newLanguages.findIndex(language => {
      return language.locale === locale;
    });

    // if empty value is picked set variant to none
    if (value === '') {
      newLanguages[languageIndex] = {
        ...newLanguages[languageIndex],
        variant: null,
      } as UserLanguage;

      setUserLanguages(newLanguages);
    }

    const variant = variants.find(variant => {
      return variant.id === parseInt(value, 10);
    });

    // check if value is a valid variant
    if (!variant) {
      return;
    }

    newLanguages[languageIndex] = {
      ...newLanguages[languageIndex],
      variant,
    } as UserLanguage;

    setUserLanguages(newLanguages);
  };

  if (!variants) {
    return null;
  }

  const selectedValue = getUserLanguageVariant();
  const language = nativeNames[locale];

  return (
    <Localized
      id="profile-form-variant"
      attrs={{ label: true }}
      vars={{ language }}>
      <LabeledSelect
        value={selectedValue}
        onChange={handleChange}
        name="variant">
        <option value={DEFAULT_OPTION_VALUE}>
          {getLocalizedString('profile-form-variant-default-value')}
        </option>
        {variants.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </LabeledSelect>
    </Localized>
  );
};

export default withLocalization(InputLanguageVariant);
