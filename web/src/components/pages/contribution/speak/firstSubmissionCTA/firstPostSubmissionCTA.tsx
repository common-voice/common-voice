import { Localized } from '@fluent/react';
import { UserLanguage } from 'common';
import React, { useEffect, useState } from 'react';
import InputLanguageVariant from '../../../profile/info/languages/input-language-variant';
import InputLanguageAccents from '../../../profile/info/languages/input-language-accents/input-language-accents';

import { useAPI } from '../../../../../hooks/store-hooks';
import {
  AccentsAll,
  VariantsAll,
} from '../../../profile/info/languages/languages';
import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { QuestionMarkIcon } from '../../../../ui/icons';
import { Button } from '../../../../ui/ui';

import './firstPostSubmissionCTA.css';

type FirstPostSubmissionCtaProps = {
  locale: string;
};

export const FirstPostSubmissionCta: React.FC<FirstPostSubmissionCtaProps> = ({
  locale,
}) => {
  const [areLanguagesLoading, setAreLanguagesLoading] = useState(true);

  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([
    { locale, accents: [] },
  ]);
  const [accentsAll, setAccentsAll] = useState<AccentsAll>({});
  const [variantsAll, setVariantsAll] = useState<VariantsAll>({});

  const api = useAPI();

  useEffect(() => {
    if (areLanguagesLoading) {
      Promise.all([
        api.getAccents().then(setAccentsAll),
        api.getVariants().then(setVariantsAll),
      ]).then(() => {
        setAreLanguagesLoading(false);
      });
    }
  }, []);

  return (
    <div className="first-cta-container">
      <Localized id="first-cta-header-text">
        <h1 className="header-text">
          Thank you for donating your voice clips!
        </h1>
      </Localized>

      <div>
        <Localized id="first-cta-subtitle-text">
          <h2 className="subtitle-text">
            Would you like to share some information about how you speak?
          </h2>
        </Localized>

        <div className="form-fields">
          {userLanguages.map(({ locale, accents }) => (
            <div className="language-wrap" key={locale}>
              <InputLanguageVariant
                locale={locale}
                variantsAll={variantsAll}
                userLanguages={userLanguages}
                setUserLanguages={setUserLanguages}
              />

              <div className="accents-input-wrapper">
                <InputLanguageAccents
                  locale={locale}
                  accents={accents}
                  accentsAll={accentsAll}
                  userLanguages={userLanguages}
                  setUserLanguages={setUserLanguages}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="expandable-infomation-wrapper">
        <ExpandableInformation
          summaryLocalizedId="why-donate"
          icon={<QuestionMarkIcon />}
          hideBorder>
          <Localized id="why-donate-explanation-1">
            <p />
          </Localized>
          <Localized id="why-donate-explanation-2">
            <p />
          </Localized>
          <Localized id="why-donate-explanation-3">
            <p />
          </Localized>
        </ExpandableInformation>
      </div>
      <div className="submission-buttons">
        <Localized id="add-information-button">
          <Button rounded className="add-information-button">
            Add information
          </Button>
        </Localized>
        <Localized id="continue-speaking-button">
          <Button rounded>No thanks, continue speaking</Button>
        </Localized>
      </div>
      <Localized
        id="create-profile-text"
        elems={{ createProfile: <a href="/login">Create a Profile</a> }}>
        <p className="create-profile-text">
          Want to save your information? Create a profile
        </p>
      </Localized>
    </div>
  );
};
