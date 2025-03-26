import * as React from 'react';
import { Localized } from '@fluent/react';
import { UserLanguage } from 'common';
import classNames from 'classnames';
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

import './firstPostSubmissionCTA.css'
import { COUNTRIES } from '../../../../../countries'

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
  >([{ locale, accents: [] }], USER_LANGUAGES)

  const [accentsAll, setAccentsAll] = React.useState<AccentsAll>({})
  const [variantsAll, setVariantsAll] = React.useState<VariantsAll>({})
  const [age, setAge] = React.useState('')
  const [gender, setGender] = React.useState('')
  const [country, setCountry] = React.useState('')
  const [emailAddress, setEmailAddress] = React.useState('')

  const isVariantInputVisible = Boolean(variantsAll[locale])

  // is email address valid
  const isValidEmailAddress = (emailAddress: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailAddress).toLowerCase());
  }
  const isAddInformationButtonDisabled =
    userLanguages[0].accents.length === 0 && !userLanguages[0].variant || !isValidEmailAddress(emailAddress)

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
      age,
      gender,
      country,
      emailAddress
    };

    try {
      await saveAnonymousAccount(data);
      addNotification(successUploadMessage, 'success');
    } catch {
      addNotification(errorUploadMessage, 'error');
    }

    onReset();
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
              className={classNames('language-wrap', {
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
            </div>
          ))}
    <div className="grid grid-cols-1 mx-auto space-y-4 max-w-[650px] w-[100%]">
  {/* Fieldset for age, gender, and country */}
  <fieldset className="border border-gray-300 p-4 rounded-lg">
    <legend className="text-black text-md px-2">تفاصيل المستخدم</legend>
    <div className="input-group flex flex-col mt-4">
      <label htmlFor="email" className="text-gray-500 text-md">البريد الشبكي*:</label>
      <input
        type="email"
        id="email"
        name="email"
        className="mt-1 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
        placeholder="البريد الشبكي"
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      {/* Email Should be mendatory */}
      {!isValidEmailAddress(emailAddress) && emailAddress.length > 0 &&
        <span className="text-red-500 text-sm">البريد الشبكي غير صالح</span>
      }

    </div>
    <div className="input-group flex flex-col mt-4">
      <label htmlFor="age" className="text-gray-500 text-md">العمر:</label>
      <select
        id="age"
        name="age"
        className="mt-1 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
        onChange={(e) => setAge(e.target.value)}
      >
        <option value="">اختر عمرك</option>
        <option value="10-5 سنوات">10-5 سنوات</option>
        <option value="15-11 سنة">15-11 سنة</option>
        <option value="20-16 سنة">20-16 سنة</option>
        <option value="40-21 سنة">40-21 سنة</option>
        <option value="60-41 سنة">60-41 سنة</option>
        <option value="أكبر من 60 سنة">أكبر من 60 سنة</option>
      </select>
    </div>
    <div className="input-group flex flex-col mt-4">
      <label htmlFor="gender" className="text-gray-500 text-md">الجنس:</label>
      <select
        id="gender"
        name="gender"
        className="mt-1 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">اختر جنسك</option>
        <option value="male">ذكر</option>
        <option value="female">أنثى</option>
      </select>
    </div>
    <div className="input-group flex flex-col mt-4">
      <label htmlFor="country" className="text-gray-500 text-md">الدولة:</label>
      <select
        id="country"
        name="country"
        className="mt-1 px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">اختر دولتك</option>
        {COUNTRIES.sort((a, b) => a.name.localeCompare(b.name)).map((country) => (
          <option key={country.value} value={country.value}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  </fieldset>
</div>

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
        {/* <Localized id="add-information-button"> */}
        <Button
          className="add-information-button"
          onClick={handleAddInformationClick}
          data-testid="add-information-button"
          disabled={isAddInformationButtonDisabled}>
          إرسال المعلومات
        </Button>
        {/* </Localized> */}
        <Localized id="continue-speaking-button">
        <Button
          rounded
          onClick={onReset}
          data-testid="continue-speaking-button">
        </Button>
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
  )
}
