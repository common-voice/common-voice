import * as React from 'react';
import { useState } from 'react';
import { Localized } from '@fluent/react';

import { useAPI } from '../../../../../hooks/store-hooks';
import { Button } from '../../../../ui/ui';
import { Accent, Variant, UserLanguage } from 'common';
import { useEffect } from 'react';

import InputLanguageName from './input-language-name';
import InputLanguageVariant from './input-language-variant';
import InputLanguageAccents from './input-language-accents/input-language-accents';
import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { VariantContributionOptions } from '../variant-contribution-options';

import URLS from '../../../../../urls';
import { LocaleLink } from '../../../../locale-helpers';

import './languages.css';

export type AccentsAll = {
  [locale: string]: {
    default: Accent;
    userGenerated: { [id: string]: Accent };
    preset: { [id: string]: Accent };
  };
};

export type VariantsAll = {
  [locale: string]: Array<Variant>;
};

interface Props {
  userLanguages: UserLanguage[];
  areLanguagesLoading: boolean;
  setUserLanguages: (userLanguages: UserLanguage[]) => void;
  setAreLanguagesLoading: (value: boolean) => void;
}

function ProfileInfoLanguages({
  userLanguages,
  areLanguagesLoading,
  setUserLanguages,
  setAreLanguagesLoading,
}: Props) {
  const api = useAPI();
  const [accentsAll, setAccentsAll] = useState<AccentsAll>({});
  const [variantsAll, setVariantsAll] = useState<VariantsAll>({});

  const hasUserLanguages = userLanguages.length > 0;
  const hasUserLanguagesWithVariants = userLanguages.some(language => {
    const variants = variantsAll[language.locale];
    return variants && variants.length > 0;
  });
  const hasNewEmptyLanguage =
    hasUserLanguages && !userLanguages[userLanguages.length - 1].locale;

  const handleAddNewLanguageButtonClick = () => {
    if (hasNewEmptyLanguage) {
      return;
    }
    setUserLanguages(userLanguages.concat({ locale: '', accents: [] }));
  };

  useEffect(() => {
    if (!areLanguagesLoading) {
      return;
    }

    Promise.all([
      api.getAccents().then(setAccentsAll),
      api.getVariants().then(setVariantsAll),
    ]).then(() => {
      setAreLanguagesLoading(false);
    });
  }, []);

  if (areLanguagesLoading) {
    return null;
  }

  return (
    <>
      <Localized id="languages">
        <h2 />
      </Localized>

      <div className="form-fields">
        {userLanguages.map(({ locale, accents }) => (
          <div className="language-wrap" key={locale}>
            <InputLanguageName
              locale={locale}
              accentsAll={accentsAll}
              userLanguages={userLanguages}
              setUserLanguages={setUserLanguages}
            />

            <InputLanguageVariant
              locale={locale}
              variantsAll={variantsAll}
              userLanguages={userLanguages}
              setUserLanguages={setUserLanguages}
            />

            {hasUserLanguagesWithVariants && (
              <ExpandableInformation summaryLocalizedId="help-variants">
                <Localized id="help-variants-explanation">
                  <div />
                </Localized>
              </ExpandableInformation>
            )}

            <InputLanguageAccents
              locale={locale}
              accents={accents}
              accentsAll={accentsAll}
              userLanguages={userLanguages}
              setUserLanguages={setUserLanguages}
            />

            {hasUserLanguages && (
              <ExpandableInformation summaryLocalizedId="help-accent">
                <Localized id="help-accent-explanation">
                  <div />
                </Localized>
              </ExpandableInformation>
            )}

            <VariantContributionOptions />
          </div>
        ))}
      </div>

      <div>
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

        <div style={{ marginTop: 10 }}>
          <Localized id="request-language-text" />{' '}
          <LocaleLink to={URLS.LANGUAGE_REQUEST} className="link">
            <Localized id="request-language-button">
              <i />
            </Localized>
          </LocaleLink>
        </div>
      </div>
    </>
  );
}

export default ProfileInfoLanguages;
