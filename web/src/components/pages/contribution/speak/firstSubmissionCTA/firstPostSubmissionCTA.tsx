import * as React from 'react';
import { Localized } from '@fluent/react';
import { UserLanguage } from 'common';
import cx from 'classnames';
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
import { Button, LabeledSelect, Options } from '../../../../ui/ui';

import { GENDERS } from '../../../../../stores/demographics';

import './firstPostSubmissionCTA.css';

export const USER_LANGUAGES = 'userLanguages';

type FirstPostSubmissionCtaProps = {
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
  const saveAnonymousAccount = useAction(
    User.actions.saveAnonymousAccountLanguages
  );
  const [areLanguagesLoading, setAreLanguagesLoading] = React.useState(true);

  const [userLanguages, setUserLanguages] = useLocalStorageState<
    UserLanguage[]
  >([{ locale, accents: [] }], USER_LANGUAGES);

  const [accentsAll, setAccentsAll] = React.useState<AccentsAll>({});
  const [variantsAll, setVariantsAll] = React.useState<VariantsAll>({});
  const [gender, setGender] = React.useState('');

  const isVariantInputVisible = Boolean(variantsAll[locale]);

  const isAddInformationButtonDisabled =
    userLanguages[0].accents.length === 0 &&
    !userLanguages[0].variant &&
    gender.length === 0;

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
      gender,
    };

    try {
      await saveAnonymousAccount(data);
      addNotification(successUploadMessage, 'success');
    } catch {
      addNotification(errorUploadMessage, 'error');
    }

    onReset();
  };

  const handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(evt.target.value);
  };

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
