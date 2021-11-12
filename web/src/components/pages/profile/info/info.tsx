import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import Downshift from 'downshift';
import { useCallback, useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { useAction, useAPI } from '../../../../hooks/store-hooks';
import { NATIVE_NAMES } from '../../../../services/localization';
import { trackProfile } from '../../../../services/tracker';
import { AGES, GENDERS } from '../../../../stores/demographics';
import { Notifications } from '../../../../stores/notifications';
import { useTypedSelector } from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink, useLocale } from '../../../locale-helpers';
import TermsModal from '../../../terms-modal';
import { DownIcon, CloseIcon } from '../../../ui/icons';
import {
  Button,
  Hr,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
} from '../../../ui/ui';
import { isEnrolled } from '../../dashboard/challenge/constants';
import { AccentLocale } from 'common';

import './info.css';

const pick = require('lodash.pick');
const { Tooltip } = require('react-tippy');

// Types for Downshift haven't caught up yet. Can be removed in the future
const Input = LabeledInput as any;

const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & WithLocalizationProps) => (
    <>
      {Object.entries(children).map(([key, value]) => (
        <option key={key} value={key}>
          {getString(key, null, value)}
        </option>
      ))}
    </>
  )
);

type AccentLocales = AccentLocale[];

type Accent = {
  id: number;
  token: string;
  name: string;
};
type Accents = {
  [locale: string]: {
    userGenerated: { [id: string]: Accent };
    preset: { [id: string]: Accent };
  };
};

function ProfilePage({
  getString,
  history,
}: WithLocalizationProps & RouteComponentProps<any, any, any>) {
  const api = useAPI();
  const [locale, toLocaleRoute] = useLocale();
  const user = useTypedSelector(({ user }) => user);
  const { account, userClients } = user;

  const addNotification = useAction(Notifications.actions.addPill);
  const addUploads = useAction(Uploads.actions.add);
  const saveAccount = useAction(User.actions.saveAccount);

  const [userFields, setUserFields] = useState<{
    username: string;
    visible: number | string;
    age: string;
    gender: string;
    sendEmails: boolean;
    privacyAgreed: boolean;
  }>({
    username: '',
    visible: 0,
    age: '',
    gender: '',
    sendEmails: false,
    privacyAgreed: false,
  });
  const {
    username,
    visible,
    age,
    gender,
    sendEmails,
    privacyAgreed,
  } = userFields;
  const [accentLocales, setAccentLocales] = useState<AccentLocales>([]);
  const [accents, setAccents] = useState<Accents>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDemographicInfo, setShowDemographicInfo] = useState(false);
  const [termsStatus, setTermsStatus] = useState<null | 'show' | 'agreed'>(
    null
  );
  const isEnrolledInChallenge =
    user?.userClients[0]?.enrollment || isEnrolled(account);

  useEffect(() => {
    if (user.isFetchingAccount || isInitialized) {
      return;
    }

    api.getAccents().then(accents => {
      setAccents(accents);
      setIsInitialized(true);
    });

    if (!account && userClients.length == 0) {
      history.push('/');
    }

    setUserFields({
      ...userFields,
      sendEmails: !!account?.basket_token,
      visible: 0,
      ...pick(user, 'age', 'username', 'gender'),
      ...(account
        ? pick(account, 'age', 'username', 'gender', 'visible')
        : {
            age: userClients.reduce((init, u) => u.age || init, ''),
            gender: userClients.reduce((init, u) => u.gender || init, ''),
          }),
      privacyAgreed: Boolean(account) || user.privacyAgreed,
    });

    // @TODO - Jenny - need to verify default behaviour as it's english in NV
    // https://gitlab-master.nvidia.com/nvspeechcommons/voice-web/-/merge_requests/12/diffs
    let accentLocales: AccentLocales = [];
    if (!account) {
      accentLocales = userClients.reduce(
        (locales, u) => locales.concat(u.locales || []),
        []
      );
      accentLocales = accentLocales.filter(
        (l1, i) => i == accentLocales.findIndex(l2 => l2.locale == l1.locale)
      );
    }
    setAccentLocales(account ? account.locales : accentLocales);
  }, [user]);

  const handleChangeFor = (field: string) => ({
    target,
  }: React.ChangeEvent<any>) => {
    setUserFields({
      ...userFields,
      [field]: target.type == 'checkbox' ? target.checked : target.value,
    });
  };

  // @TODO - Jenny - this may not be required?
  const getAutocompleteAccents = (locale: string) => {
    return accents[locale]
      ? Object.entries({
          ...accents[locale].userGenerated,
          ...accents[locale].preset,
        }).reduce((acc, [_, accent]) => {
          return acc.concat(accent);
        }, [])
      : [];
  };

  const updateCustomAccent = (accent: any, locale: string, index: number) => {
    const accentName = typeof accent === 'string' ? accent : accent.name;
    const accentId = typeof accent === 'string' ? null : accent.id;

    const newLocales = accentLocales.slice();

    // @TODO - Jenny - need to verify this makes sense without user-set accents
    const accentExists = newLocales[index].accents.filter((accentObj) => {
      return accentObj.accent === accentName;
    }).length > 0;

    if (accentExists) return;

    // if this is new custom accent, input value will be string
    // otherwise it will be Accent
    newLocales[index] = {
      locale,
      accents: (newLocales[index].accents || []).concat({
        accent: accentName,
        accent_id: accentId
      })
    };

    setAccentLocales(newLocales);
  };

  const removeAccent = (languageIndex: number, accentIndex: number) => {
    const newAccents = accentLocales.slice();
    newAccents[languageIndex].accents.splice(accentIndex, 1);
    setAccentLocales(
      newAccents
    );
  };

  function stateReducer(state: any, changes: any) {
    // this clears out the Downshift input upon selecting an accent
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          inputValue: ''
        }
      default:
        return changes
    }
  }

  const submit = useCallback(() => {
    if (!user.account) {
      trackProfile('create', locale);

      if (termsStatus == null) {
        setTermsStatus('show');
        return;
      }
    }

    setIsSaving(true);
    setIsSubmitted(true);
    setTermsStatus('agreed');

    const data = {
      ...pick(userFields, 'username', 'age', 'gender'),
      locales: accentLocales.filter(l => l.locale),
      visible: JSON.parse(visible.toString()),
      client_id: user.userId,
      enrollment: user.userClients[0].enrollment || {
        team: null,
        challenge: null,
        invite: null,
      },
    };

    addUploads([
      async () => {
        await saveAccount(data);
        if (!user.account?.basket_token && sendEmails) {
          await api.subscribeToNewsletter(user.userClients[0].email);
        }

        addNotification(getString('profile-form-submit-saved'));
        setIsSaving(false);
      },
    ]);
  }, [api, getString, locale, accentLocales, termsStatus, user, userFields]);

  if (!isInitialized) {
    return null;
  }

  if (!isSaving && isSubmitted && isEnrolledInChallenge) {
    return (
      <Redirect
        to={{
          pathname: toLocaleRoute(URLS.DASHBOARD + URLS.CHALLENGE),
          state: {
            showOnboardingModal: true,
            earlyEnroll: window.location.search.includes('achievement=1'),
          },
        }}
      />
    );
  }

  return (
    <div className="profile-info">
      {termsStatus == 'show' && (
        <TermsModal onAgree={submit} onDisagree={() => setTermsStatus(null)} />
      )}
      {!user.account && (
        <Localized id="thanks-for-account">
          <h2 />
        </Localized>
      )}
      <Localized id="why-profile-text">
        <p />
      </Localized>

      <div
        className={
          'demographic-info ' + (showDemographicInfo ? 'expanded' : '')
        }>
        <button
          type="button"
          onClick={() => setShowDemographicInfo(!showDemographicInfo)}>
          <Localized id="why-demographic">
            <span />
          </Localized>

          <DownIcon />
        </button>
        <Localized id="why-demographic-explanation-2">
          <div className="explanation" />
        </Localized>
      </div>

      <div className="form-fields">
        <Localized id="profile-form-username" attrs={{ label: true }}>
          <LabeledInput
            value={username}
            onChange={handleChangeFor('username')}
          />
        </Localized>

        <Localized id="leaderboard-visibility" attrs={{ label: true }}>
          <LabeledSelect
            value={visible.toString()}
            onChange={handleChangeFor('visible')}>
            <Localized id="hidden">
              <option value={0} />
            </Localized>
            <Localized id="visible">
              <option value={1} />
            </Localized>
            {isEnrolledInChallenge && (
              <option value={2}>Visible within challenge team</option>
            )}
          </LabeledSelect>
        </Localized>

        <Localized id="profile-form-age" attrs={{ label: true }}>
          <LabeledSelect value={age} onChange={handleChangeFor('age')}>
            <Options>{AGES}</Options>
          </LabeledSelect>
        </Localized>

        <Localized id="profile-form-gender-2" attrs={{ label: true }}>
          <LabeledSelect value={gender} onChange={handleChangeFor('gender')}>
            <Options>{GENDERS}</Options>
          </LabeledSelect>
        </Localized>

        {accentLocales.map(({ locale, accents }, i) => (
          <div className="accent-wrap" key={i}>
            <Localized
              id="language"
              attrs={{ label: true }}>
              <LabeledSelect
                value={locale}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLSelectElement>) => {
                  const newLocales = accentLocales.slice();
                  newLocales[i] = { locale: value, accents: [] };
                  if (!value) {
                    newLocales.splice(i, 1);
                  }
                  setAccentLocales(
                    newLocales.filter(
                      ({ locale }, i2) => i2 === i || locale !== value
                    )
                  );
                }}>
                <option value="" />
                {Object.entries(NATIVE_NAMES).map(([locale, name]) => (
                  <option key={locale} value={locale}>
                    {name}
                  </option>
                ))}
              </LabeledSelect>
            </Localized>
            <Localized id="profile-form-accent" attrs={{ label: true }}/>
            {locale && locale.length > 0 ? (
              <>

              <Downshift
                id="accent-selection"
                onChange={selection => {
                  updateCustomAccent(selection, locale, i);
                }}
                stateReducer={stateReducer}
                itemToString={item => (item ? item.name : '')}>
                {({
                  getInputProps,
                  getItemProps,
                  openMenu,
                  getMenuProps,
                  isOpen,
                  inputValue,
                  highlightedIndex,
                }) => {
                  const clean = (text: string) => {
                    return text ? text.trim().toLowerCase() : '';
                  };

                  const options = getAutocompleteAccents(locale).filter(item => clean(item.name).includes(clean(inputValue)));

                  return (
                    <div>
                      <Localized
                        id="profile-form-custom-accent-help-text"
                        attrs={{ label: true }}>
                        <Input
                          {...getInputProps({
                            onFocus: openMenu,
                            type: 'text',
                            value: inputValue || '',
                          })}
                          placeholder={getString(
                            'profile-form-custom-accent-placeholder'
                          )}
                        />
                      </Localized>

                      {isOpen ? (
                        <ul
                          {...getMenuProps()}
                          className={isOpen ? 'downshift-open' : ''}>
                          {options.map((item, index) => (
                            <li
                              {...getItemProps({
                                key: item.name,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index
                                      ? 'var(--light-grey)'
                                      : 'initial',
                                  fontWeight:
                                    clean(inputValue) === clean(item.name) ||
                                    inputValue === item.name
                                      ? 'bold'
                                      : 'normal',
                                },
                              })}>
                              {item.name}
                            </li>
                          ))}
                          {inputValue?.length > 0 && options.length == 0 && (
                            <li {...getItemProps({ item: inputValue })} className="add-new-accent">
                              Add new custom accent "{inputValue}" // TODO JENNY FIX
                            </li>)}
                        </ul>
                      ) : null}
                    </div>
                  );
                }}
              </Downshift>
                  {accents.map((accent, idx) => {
                    return accent.accent.length > 0 && (
                      <span key={`accent-${idx}`}
                      className="selected-accent">
                        <CloseIcon black onClick={() => removeAccent(i, idx)} />
                        {accent.accent}
                      </span>
                    )})
                  }
                  </>): null
                }


              </div>
              ))}
            </div>
            <div className="add-language-section">
              <Button
                className="add-language"
                outline
                onClick={() => {
                  if (
                    accentLocales.length &&
                    !accentLocales[accentLocales.length - 1].locale
                  ) {
                    return;
                  }
                  setAccentLocales(accentLocales.concat({ locale: '' }));
                }}>
                <Localized id="add-language">
                  <span />
                </Localized>
                <span>+</span>
              </Button>
              {accentLocales.length == 0 ? <Localized id="profile-select-language"><span className="no-languages" /></Localized> : null }


      </div>
      <Hr />

      {!user.account?.basket_token && (
        <>
          <div className="signup-section">
            <Tooltip
              arrow
              html={getString('change-email-setings')}
              theme="grey-tooltip">
              <Localized id="email-input" attrs={{ label: true }}>
                <LabeledInput value={user.userClients[0].email} disabled />
              </Localized>
            </Tooltip>

            <div className="checkboxes">
              <LabeledCheckbox
                label={
                  <>
                    <Localized id="email-opt-in-info-title">
                      <strong />
                    </Localized>
                    <Localized id="email-opt-in-info-sub-with-challenge">
                      <span />
                    </Localized>
                  </>
                }
                onChange={handleChangeFor('sendEmails')}
                checked={sendEmails}
              />



                  <LabeledCheckbox
                    {...(user.account || isSubmitted) ? {disabled: true} : {}}
                    label={
                      <>
                        <Localized id="accept-privacy-title">
                          <strong />
                        </Localized>
                        <Localized
                          id="accept-privacy"
                          elems={{
                            privacyLink: <LocaleLink to={URLS.PRIVACY} blank />,
                          }}>
                          <span />
                        </Localized>
                      </>
                    }
                    checked={privacyAgreed}
                    onChange={handleChangeFor('privacyAgreed')}
                  />

                  <Localized id="read-terms-q">
                    <LocaleLink
                      to={
                        isEnrolledInChallenge
                          ? URLS.CHALLENGE_TERMS
                          : URLS.TERMS
                      }
                      className="terms"
                      blank
                    />
                  </Localized>


            </div>
          </div>

          <Hr />
        </>
      )}

      <Localized id="profile-form-submit-save">
        <Button
          className="save"
          rounded
          disabled={isSaving || !privacyAgreed}
          onClick={submit}
        />
      </Localized>
    </div>
  );
}

export default withLocalization(withRouter(ProfilePage));
