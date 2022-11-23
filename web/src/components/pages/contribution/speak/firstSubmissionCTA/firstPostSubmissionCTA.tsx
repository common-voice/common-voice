import { Localized } from '@fluent/react';
import { UserLanguage } from 'common';
// import React, { useEffect, useState } from 'react';
import * as React from 'react';
import InputLanguageVariant from '../../../profile/info/languages/input-language-variant';
import InputLanguageAccents from '../../../profile/info/languages/input-language-accents/input-language-accents';

import { User } from '../../../../../stores/user';
import {
  useAction,
  useAPI,
  useLocalStorageState,
} from '../../../../../hooks/store-hooks';
import { Notifications } from '../../../../../stores/notifications';
import {
  AccentsAll,
  VariantsAll,
} from '../../../profile/info/languages/languages';
import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { QuestionMarkIcon } from '../../../../ui/icons';
import { Button } from '../../../../ui/ui';

import './firstPostSubmissionCTA.css';

export const USER_LANGUAGES = 'userLanguages';

type FirstPostSubmissionCtaProps = {
  locale: string;
  onReset: () => void;
  hideVisibility: () => void;
  addNotification: typeof Notifications.actions.addPill;
  successUploadMessage: string;
  errorUploadMessage: string;
};

export const FirstPostSubmissionCta: React.FC<FirstPostSubmissionCtaProps> = ({
  locale,
  onReset,
  hideVisibility,
  addNotification,
  successUploadMessage,
  errorUploadMessage,
}) => {
  const saveAccount = useAction(User.actions.saveAccount);
  const [areLanguagesLoading, setAreLanguagesLoading] = React.useState(true);

  const [userLanguages, setUserLanguages] = useLocalStorageState<
    UserLanguage[]
  >([{ locale, accents: [] }], USER_LANGUAGES);

  const [accentsAll, setAccentsAll] = React.useState<AccentsAll>({});
  const [variantsAll, setVariantsAll] = React.useState<VariantsAll>({});

  const isAddInformationButtonDisabled =
    userLanguages[0].accents.length === 0 && !userLanguages[0].variant;

  const api = useAPI();

  React.useEffect(() => {
    if (areLanguagesLoading) {
      Promise.all([
        api.getAccents().then(setAccentsAll),
        api.getVariants().then(setVariantsAll),
      ]).then(() => {
        setAreLanguagesLoading(false);
      });
    }
  }, []);

  const handleAddInformationClick = async () => {
    const data = {
      languages: userLanguages,
    };

    try {
      await saveAccount(data);
      addNotification(successUploadMessage, 'success');
    } catch {
      addNotification(errorUploadMessage, 'error');
    }

    onReset();
    hideVisibility();
  };

  return (
    <div className="first-cta-container">
      <div className="header-text-container">
        <Localized id="first-cta-header-text">
          <h1 className="header-text">
            Thank you for donating your voice clips!
          </h1>
        </Localized>
      </div>

      <div>
        <div className="subtitle-text-container">
          <Localized id="first-cta-subtitle-text">
            <h2 className="subtitle-text">
              Would you like to share some information about how you speak?
            </h2>
          </Localized>
        </div>

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
          hideBorder
          alignCenter>
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
          <Button
            rounded
            className="add-information-button"
            onClick={handleAddInformationClick}
            data-testid="add-information-button"
            disabled={isAddInformationButtonDisabled}>
            Add information
          </Button>
        </Localized>
        <Localized id="continue-speaking-button">
          <Button
            rounded
            onClick={onReset}
            data-testid="continue-speaking-button">
            No thanks, continue speaking
          </Button>
        </Localized>
      </div>
      <Localized
        id="create-profile-text"
        elems={{
          createProfile: <a href="/login">Create a Profile</a>,
        }}>
        <p className="create-profile-text">
          Want to save your information? Create a profile
        </p>
      </Localized>
    </div>
  );
};
