import * as React from 'react';
import { useState } from 'react';
import { Localized } from '@fluent/react';

import { useAPI } from '../../../../../hooks/store-hooks';
import { DownIcon } from '../../../../ui/icons';
import { Button } from '../../../../ui/ui';
import { Accent, UserLanguage } from 'common';
import { useEffect } from 'react';

import InputLanguageName from './input-language-name';
import InputLanguageAccents from './input-language-accents/input-language-accents';

import './languages.css';

export type AccentsAll = {
  [locale: string]: {
    default: Accent;
    userGenerated: { [id: string]: Accent };
    preset: { [id: string]: Accent };
  };
};

interface Props {
  userLanguages: UserLanguage[];
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
  setAreLanguagesLoading: (value: boolean) => void;
}

function ProfileInfoLanguages({
  userLanguages,
  setUserLanguages,
  setAreLanguagesLoading,
}: Props) {
  const api = useAPI();
  const [accentsAll, setAccentsAll] = useState<AccentsAll>({});
  const [showAccentInfo, setShowAccentInfo] = useState(false);
  const [hasAccentDataLoaded, setHasAccentDataLoaded] = useState(false);
  const hasUserLanguages = userLanguages.length > 0;
  const hasNewEmptyLanguage =
    hasUserLanguages && !userLanguages[userLanguages.length - 1].locale;

  const handleAddNewLanguageButtonClick = () => {
    if (hasNewEmptyLanguage) {
      return;
    }
    setUserLanguages(userLanguages.concat({ locale: '', accents: [] }));
  };

  useEffect(() => {
    if (hasAccentDataLoaded) {
      return;
    }

    api.getAccents().then(accents => {
      setAccentsAll(accents);
      setHasAccentDataLoaded(true);
      setAreLanguagesLoading(false);
    });
  }, []);

  if (!hasAccentDataLoaded) {
    return null;
  }

  return (
    <>
      <h2>Languages</h2>

      <div className="form-fields">
        {userLanguages.map(({ locale, accents }) => (
          <div className="language-wrap" key={locale}>
            <InputLanguageName
              locale={locale}
              accentsAll={accentsAll}
              userLanguages={userLanguages}
              setUserLanguages={setUserLanguages}
            />

            <InputLanguageAccents
              locale={locale}
              accents={accents}
              accentsAll={accentsAll}
              userLanguages={userLanguages}
              setUserLanguages={setUserLanguages}
            />
          </div>
        ))}
      </div>

      <div>
        {hasUserLanguages && (
          <div
            className={'profile-toggle ' + (showAccentInfo ? 'expanded' : '')}>
            <button
              type="button"
              onClick={() => setShowAccentInfo(!showAccentInfo)}>
              <Localized id="help-accent">
                <span />
              </Localized>

              <DownIcon />
            </button>
            <Localized id="help-accent-explanation">
              <div className="explanation" />
            </Localized>
          </div>
        )}

        <Button
          className="add-language"
          outline
          disabled={hasNewEmptyLanguage}
          onClick={handleAddNewLanguageButtonClick}>
          <Localized id="add-language">
            <span />
          </Localized>
          <span aria-hidden={true}>+</span>
        </Button>

        {!hasUserLanguages && (
          <Localized id="profile-select-language">
            <span className="no-languages" />
          </Localized>
        )}
      </div>
    </>
  );
}

export default ProfileInfoLanguages;
