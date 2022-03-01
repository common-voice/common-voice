import * as React from 'react';

import { UserLanguage } from 'common';
import { CloseIcon } from '../../../../../ui/icons';
import VisuallyHidden from '../../../../../visually-hidden/visually-hidden';

interface Props {
  locale?: string;
  accents: Array<{ id: number; name: string }>;
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
}

const InputLanguageAccents = ({
  locale,
  accents,
  setUserLanguages,
  userLanguages,
}: Props) => {
  if (!locale || locale.length === 0) {
    return null;
  }

  const removeAccent = (locale: string, accentIndex: number) => {
    const newLanguages = userLanguages.slice() as UserLanguage[];
    const languageIndex = newLanguages.findIndex(language => {
      return language.locale === locale;
    });
    newLanguages[languageIndex].accents.splice(accentIndex, 1);
    setUserLanguages(newLanguages);
  };

  return (
    <>
      {accents.map((accent, index) => {
        if (accent.name?.length === 0) {
          return null;
        }

        return (
          <span key={`accent-${index}`} className="selected-accent">
            {accent.name}
            <button
              className="selected-accent--button"
              onClick={() => removeAccent(locale, index)}>
              <VisuallyHidden>Remove {accent.name} accent</VisuallyHidden>
              <CloseIcon black />
            </button>
          </span>
        );
      })}
    </>
  );
};

export default InputLanguageAccents;
