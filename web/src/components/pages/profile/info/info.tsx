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
import { Accent, UserAccentLocale } from 'common';

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

type UserAccentLocales = UserAccentLocale[];

type AccentsAll = {
  [locale: string]: {
    default: Accent;
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
  const [userAccentLocales, setUserAccentLocales] = useState<UserAccentLocales>([]);
  const [accentsAll, setAccentsAll] = useState<AccentsAll>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDemographicInfo, setShowDemographicInfo] = useState(false);
  const [showAccentInfo, setShowAccentInfo] = useState(false);
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
      setAccentsAll(accents);
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

    let userAccentLocales: UserAccentLocale[] = [];
    if (!account) {
      userAccentLocales = userClients.reduce(
        (locales, u) => locales.concat(u.locales || []),
        []
      );
      userAccentLocales = userAccentLocales.filter(
        (l1, i) => i == userAccentLocales.findIndex(l2 => l2.locale == l1.locale)
      );
    }

    setUserAccentLocales(account ? account.locales : userAccentLocales);
  }, [user]);

  const handleChangeFor = (field: string) => ({
    target,
  }: React.ChangeEvent<any>) => {
    setUserFields({
      ...userFields,
      [field]: target.type == 'checkbox' ? target.checked : target.value,
    });
  };

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

    const newLocales = userAccentLocales.slice();

    const accentExists = newLocales[index].accents.filter((accentObj) => {
      return accentObj.name === accentName;
    }).length > 0;

    if (accentExists) return;

    // if this is new custom accent, input value will be string
    // otherwise it will be Accent
    newLocales[index] = {
      locale,
      accents: (newLocales[index].accents || []).concat({
        name: accentName,
        id: accentId
      })
    };

    setUserAccentLocales(newLocales);
  };

  const removeAccent = (languageIndex: number, accentIndex: number) => {
    const newAccents = userAccentLocales.slice();
    newAccents[languageIndex].accents.splice(accentIndex, 1);
    setUserAccentLocales(
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
      locales: userAccentLocales.filter(l => l.locale),
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
  }, [api, getString, locale, userAccentLocales, termsStatus, user, userFields]);

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
          'profile-toggle ' + (showDemographicInfo ? 'expanded' : '')
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

      <div className={`form-fields ${userAccentLocales.length > 1 ? 'multilingual' : '' }`}>
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
        {userAccentLocales.map(({ locale, accents }, i) => (
          <div className="accent-wrap" key={i}>
            <Localized
              id="profile-form-language"
              attrs={{ label: true }}>
              <LabeledSelect
                value={locale}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLSelectElement>) => {
                  const newLocales = userAccentLocales.slice();
                  newLocales[i] = { locale: value, accents: accentsAll[value]? [accentsAll[value]?.default] : [] };
                  if (!value) {
                    newLocales.splice(i, 1);
                  }
                  setUserAccentLocales(
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
                  selectItem
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
                          disabled={locale.length === 0}
                          {...getInputProps({
                            onFocus: openMenu,
                            type: 'text',
                            value: inputValue || '',
                            onKeyDown: (e: any) => {
                              if (e.key === 'Enter') {
                                selectItem(e.target.value, {
                                  type: Downshift.stateChangeTypes.keyDownEnter,
                                })
                              }
                            }
                          })}
                          placeholder={getString(
                            'profile-form-custom-accent-placeholder-2'
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
                                },
                              })}>
                              {item.name}
                            </li>
                          ))}
                          {inputValue?.length > 0 && options.length == 0 && (
                            <li {...getItemProps({ item: inputValue })} className="add-new-accent">
                              <Localized id="profile-form-add-accent" vars={{inputValue}} />
                            </li>)}
                        </ul>
                      ) : null}
                    </div>
                  );
                }}
              </Downshift>
              {locale && locale.length > 0 ? (
                <>
                  {accents.map((accent, idx) => {
                    return accent.name?.length > 0 && (
                      <span key={`accent-${idx}`}
                      className="selected-accent">
                        <CloseIcon black onClick={() => removeAccent(i, idx)} />
                        {accent.name}
                      </span>
                    )})
                  }
                  </>
                ): null }
              </div>
              ))}
            </div>
            <div className="add-language-section">
              {userAccentLocales.length > 0 ? <div
                className={
                  'profile-toggle ' + (showAccentInfo ? 'expanded' : '')
                }>
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
              </div> : null }

              <Button
                className="add-language"
                outline
                onClick={() => {
                  if (
                    userAccentLocales.length &&
                    !userAccentLocales[userAccentLocales.length - 1].locale
                  ) {
                    return;
                  }
                  setUserAccentLocales(userAccentLocales.concat({ locale: '', accents: [] }));
                }}>
                <Localized id="add-language">
                  <span />
                </Localized>
                <span>+</span>
              </Button>
              {userAccentLocales.length == 0 ?
                <Localized id="profile-select-language"><span className="no-languages" /></Localized> :
                null
              }


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
