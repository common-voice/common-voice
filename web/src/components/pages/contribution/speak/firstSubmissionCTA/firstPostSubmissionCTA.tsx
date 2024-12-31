import * as React from 'react';
import { Localized, useLocalization } from '@fluent/react';
import cx from 'classnames';

import InputLanguageVariant from '../../../profile/info/languages/input-language-variant';
import InputLanguageAccents from '../../../profile/info/languages/input-language-accents/input-language-accents';

import { useAPI } from '../../../../../hooks/store-hooks';
import { Notifications } from '../../../../../stores/notifications';

import ExpandableInformation from '../../../../expandable-information/expandable-information';
import { QuestionMarkIcon } from '../../../../ui/icons';
import { Button, LabeledSelect, Options } from '../../../../ui/ui';

import { GENDERS } from '../../../../../stores/demographics';
import { useFirstPostSubmissionCTA } from './hooks/useFirstPostSubmissionCTA';

import './firstPostSubmissionCTA.css';

export const USER_LANGUAGES = 'userLanguages';

export type FirstPostSubmissionCtaProps = {
  locale: string;
  onReset: () => void;
  addNotification: typeof Notifications.actions.addPill;
  successUploadMessage: string;
  errorUploadMessage: string;
};

export const FirstPostSubmissionCta: React.FC<FirstPostSubmissionCtaProps> = ({
  locale,
  onReset,
  addNotification,
  successUploadMessage,
  errorUploadMessage,
}) => {
  const {
    areLanguagesLoading,
    setAreLanguagesLoading,
    accentsAll,
    setAccentsAll,
    variantsAll,
    setVariantsAll,
    setUserLanguages,
    handleAddInformationClick,
    handleSelectChange,
    gender,
    userLanguages,
    isAddInformationButtonDisabled,
    isVariantInputVisible,
  } = useFirstPostSubmissionCTA({
    locale,
    onReset,
    addNotification,
    successUploadMessage,
    errorUploadMessage,
  });

  const api = useAPI();
  const { l10n } = useLocalization();

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

  return (
    <div className="first-cta-container" data-testid="first-submission-cta">
      <div className="header-text-container">
        <Localized id="first-cta-header-text">
          <h1 className="header-text" />
        </Localized>
      </div>

      <div className="share-information-wrapper">
        <div className="subtitle-text-container">
          <Localized id="first-cta-subtitle-text">
            <h2 className="subtitle-text" />
          </Localized>
        </div>

        <div className="form-fields">
          {userLanguages.map(({ locale, accents }) => (
            <div
              className={cx('language-wrap', {
                'variant-input-visible': isVariantInputVisible,
              })}
              key={locale}>
              <InputLanguageVariant
                locale={locale}
                variantsAll={variantsAll}
                userLanguages={userLanguages}
                setUserLanguages={setUserLanguages}
              />

              <div className="accents-wrapper">
                <InputLanguageAccents
                  locale={locale}
                  accents={accents}
                  accentsAll={accentsAll}
                  userLanguages={userLanguages}
                  setUserLanguages={setUserLanguages}
                />
              </div>

              <Localized
                id="first-cta-gender-select-help-text"
                attrs={{ label: true }}>
                <LabeledSelect
                  value={gender}
                  onChange={handleSelectChange}
                  name="gender">
                  <option selected value="">
                    {l10n.getString('first-cta-gender-select-default-option')}
                  </option>
                  <Options>{GENDERS}</Options>
                </LabeledSelect>
              </Localized>
            </div>
          ))}
        </div>
      </div>

      <div className="expandable-infomation-wrapper">
        <ExpandableInformation
          summaryLocalizedId="why-donate"
          icon={<QuestionMarkIcon />}
          hideBorder
          justifyCenter>
          <Localized id="why-donate-explanation-1">
            <p />
          </Localized>
          <Localized
            id="why-donate-explanation-2"
            elems={{
              learnMore: (
                <a
                  href="https://foundation.mozilla.org/en/blog/why-metadata-matters/"
                  target="_blank"
                  rel="noreferrer"
                />
              ),
            }}>
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
            disabled={isAddInformationButtonDisabled}
          />
        </Localized>
        <Localized id="continue-speaking-button">
          <Button
            rounded
            onClick={onReset}
            data-testid="continue-speaking-button"
          />
        </Localized>
      </div>
      <Localized
        id="create-profile-text"
        elems={{
          createProfile: <a href="/login" />,
        }}>
        <p className="create-profile-text" />
      </Localized>
    </div>
  );
};
