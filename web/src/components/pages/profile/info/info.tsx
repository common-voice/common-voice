import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router';
import { useAction, useAPI } from '../../../../hooks/store-hooks';
import { NATIVE_NAMES } from '../../../../services/localization';
import { trackProfile } from '../../../../services/tracker';
import { ACCENTS, AGES, SEXES } from '../../../../stores/demographics';
import { Notifications } from '../../../../stores/notifications';
import { useTypedSelector } from '../../../../stores/tree';
import { Uploads } from '../../../../stores/uploads';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink, useLocale } from '../../../locale-helpers';
import TermsModal from '../../../terms-modal';
import { DownIcon } from '../../../ui/icons';
import {
  Button,
  Hr,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
} from '../../../ui/ui';
import { isEnrolled } from '../../dashboard/challenge/constants';

import './info.css';

const pick = require('lodash.pick');
const { Tooltip } = require('react-tippy');

const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & LocalizationProps) => (
    <React.Fragment>
      {Object.entries(children).map(([key, value]) => (
        <option key={key} value={key}>
          {getString(key, null, value)}
        </option>
      ))}
    </React.Fragment>
  )
);

type Locales = { locale: string; accent: string }[];

function ProfilePage({
  getString,
  history,
}: LocalizationProps & RouteComponentProps<any, any, any>) {
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
  const [locales, setLocales] = useState<Locales>([]);
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
    setIsInitialized(true);

    if (!account && userClients.length == 0) {
      history.push('/');
    }

    setUserFields({
      ...userFields,
      sendEmails: !!(account && account.basket_token),
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

    let locales: Locales = [];
    if (!account) {
      locales = userClients.reduce(
        (locales, u) => locales.concat(u.locales || []),
        []
      );
      locales = locales.filter(
        (l1, i) => i == locales.findIndex(l2 => l2.locale == l1.locale)
      );
    }
    setLocales(account ? account.locales : locales);
  }, [user]);

  const handleChangeFor = (field: string) => ({
    target,
  }: React.ChangeEvent<any>) => {
    setUserFields({
      ...userFields,
      [field]: target.type == 'checkbox' ? target.checked : target.value,
    });
  };

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
      locales: locales.filter(l => l.locale),
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
        if (!(user.account && user.account.basket_token) && sendEmails) {
          await api.subscribeToNewsletter(user.userClients[0].email);
        }

        addNotification(getString('profile-form-submit-saved'));
        setIsSaving(false);
      },
    ]);
  }, [api, getString, locale, locales, termsStatus, user, userFields]);

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
        <Localized id="why-demographic-explanation">
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

        <Localized id="profile-form-gender" attrs={{ label: true }}>
          <LabeledSelect value={gender} onChange={handleChangeFor('gender')}>
            <Options>{SEXES}</Options>
          </LabeledSelect>
        </Localized>

        {locales.map(({ locale, accent }, i) => (
          <React.Fragment key={i}>
            <Localized
              id={
                i == 0
                  ? 'profile-form-native-language'
                  : 'profile-form-additional-language'
              }
              attrs={{ label: true }}>
              <LabeledSelect
                value={locale}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLSelectElement>) => {
                  const newLocales = locales.slice();
                  newLocales[i] = { locale: value, accent: '' };
                  if (!value) {
                    newLocales.splice(i, 1);
                  }
                  setLocales(
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
            <Localized id="profile-form-accent" attrs={{ label: true }}>
              <LabeledSelect
                value={accent}
                onChange={({
                  target: { value },
                }: React.ChangeEvent<HTMLSelectElement>) => {
                  const newLocales = locales.slice();
                  newLocales[i].accent = value;
                  setLocales(newLocales);
                }}>
                <option value="" />
                {ACCENTS[locale] && <Options>{ACCENTS[locale]}</Options>}
              </LabeledSelect>
            </Localized>
          </React.Fragment>
        ))}
      </div>

      <Button
        className="add-language"
        outline
        onClick={() => {
          if (locales.length && !locales[locales.length - 1].locale) {
            return;
          }
          setLocales(locales.concat({ locale: '', accent: '' }));
        }}>
        <Localized id="add-language">
          <span />
        </Localized>
        <span>+</span>
      </Button>

      <Hr />

      {!(user.account && user.account.basket_token) && (
        <React.Fragment>
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

              {!user.account && !isSubmitted && (
                <>
                  <LabeledCheckbox
                    label={
                      <>
                        <Localized id="accept-privacy-title">
                          <strong />
                        </Localized>
                        <Localized
                          id="accept-privacy"
                          privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
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
                </>
              )}
            </div>
          </div>

          <Hr />
        </React.Fragment>
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
