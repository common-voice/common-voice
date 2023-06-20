import * as React from 'react';

import { UserLanguage } from 'common';
import { AccentsAll } from '../languages';

import InputLanguageAccentsInput from './input-language-accents-input';

interface Props {
  locale: string;
  accents: Array<{ id: number; name: string }>;
  accentsAll: AccentsAll;
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
}

function InputLanguageAccents({
  locale,
  accents,
  accentsAll,
  userLanguages,
  setUserLanguages,
}: Props) {
  return (
    <InputLanguageAccentsInput
      locale={locale}
      accentsAll={accentsAll}
      userLanguages={userLanguages}
      setUserLanguages={setUserLanguages}
      accents={accents}
    />
  );
}

export default InputLanguageAccents;
