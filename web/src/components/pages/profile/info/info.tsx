import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Redirect, RouteComponentProps, withRouter } from 'react-router'
import { Tooltip } from 'react-tippy'
import { pick } from 'common/utility'

import {
  useAction,
  useAPI,
  useLocalStorageState,
} from '../../../../hooks/store-hooks'
import { trackProfile } from '../../../../services/tracker'
import { AGES, GENDERS } from '../../../../stores/demographics'
import { Notifications } from '../../../../stores/notifications'
import { useTypedSelector } from '../../../../stores/tree'
import { Uploads } from '../../../../stores/uploads'
import { User } from '../../../../stores/user'
import URLS from '../../../../urls'
import { LocaleLink, useLocale } from '../../../locale-helpers'
import TermsModal from '../../../terms-modal'
import {
  Button,
  Hr,
  LabeledCheckbox,
  LabeledInput,
  LabeledSelect,
  Options,
} from '../../../ui/ui'
import { isEnrolled } from '../../dashboard/challenge/constants'
import { UserLanguage } from 'common'

import ProfileInfoLanguages from './languages/languages'
import ExpandableInformation from '../../../expandable-information/expandable-information'

import './info.css'

function ProfileInfo({
  getString,
  history,
}: WithLocalizationProps & RouteComponentProps) {
  const api = useAPI()
  const [locale, toLocaleRoute] = useLocale()
  const user = useTypedSelector(({ user }) => user)
  const { account, userClients } = user

  const addNotification = useAction(Notifications.actions.addPill)
  const addUploads = useAction(Uploads.actions.add)
  const saveAccount = useAction(User.actions.saveAccount)

  const [userFields, setUserFields] = useState<{
    username: string
    visible: number | string
    age: string
    gender: string
    sendEmails: boolean
    privacyAgreed: boolean
  }>({
    username: '',
    visible: 0,
    age: '',
    gender: '',
    sendEmails: false,
    privacyAgreed: false,
  })
  const { username, visible, age, gender, sendEmails, privacyAgreed } =
    userFields
  const [areLanguagesLoading, setAreLanguagesLoading] = useState(true)
  const [userLanguages, setUserLanguages] = useState<UserLanguage[]>([])
  const [userLanguagesInLocalStorage] = useLocalStorageState<UserLanguage[]>(
    [],
    'userLanguages'
  )
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [termsStatus, setTermsStatus] = useState<null | 'show' | 'agreed'>(null)
  const isEnrolledInChallenge =
    user?.userClients[0]?.enrollment || isEnrolled(account)

  useEffect(() => {
    if (user.isFetchingAccount || areLanguagesLoading) {
      return
    }

    if (!account && userClients.length == 0) {
      history.push('/')
    }
    console.log({ user })

    setUserFields({
      ...userFields,
      sendEmails: !!account?.basket_token,
      visible: 0,
      ...(account
        ? pick(account, ['age', 'username', 'gender', 'visible'])
        : {
            age: userClients.reduce((init, u) => u.age || init, ''),
            gender: userClients.reduce((init, u) => u.gender || init, ''),
          }),
      privacyAgreed: Boolean(account) || user.privacyAgreed,
    })

    if (account) {
      setUserLanguages(account.languages)
      return
    }

    let userLanguages: UserLanguage[] = []
    userLanguages = userClients.reduce(
      (languages, userClient) => languages.concat(userClient.languages || []),
      userLanguagesInLocalStorage
    )
    userLanguages = userLanguages.filter(
      (l1, i) => i == userLanguages.findIndex(l2 => l2.locale == l1.locale)
    )

    setUserLanguages(userLanguages)
  }, [user, areLanguagesLoading])

  const handleChangeFor =
    (field: string) =>
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      setUserFields({
        ...userFields,
        [field]: target.type == 'checkbox' ? target.checked : target.value,
      })
    }

  const submit = useCallback(() => {
    if (!user.account) {
      trackProfile('create', locale)

      if (termsStatus == null) {
        setTermsStatus('show')
        return
      }
    }

    setIsSaving(true)
    setIsSubmitted(true)
    setTermsStatus('agreed')

    const data = {
      ...pick(userFields, ['username', 'age', 'gender']),
      languages: userLanguages.filter(l => l.locale),
      visible: JSON.parse(visible.toString()),
      client_id: user.userId,
      enrollment: user.userClients[0].enrollment || {
        team: null,
        challenge: null,
        invite: null,
      },
    }

    addUploads([
      async () => {
        await saveAccount(data)
        if (!user.account?.basket_token && sendEmails) {
          await api.subscribeToNewsletter(user.userClients[0]?.email)
        }

        addNotification(getString('profile-form-submit-saved'))
        setIsSaving(false)
      },
    ])
  }, [api, getString, locale, userLanguages, termsStatus, user, userFields])

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
    )
  }

  return (
    <div className="profile-info">
      <Localized id="profile">
        <h1 />
      </Localized>

      {termsStatus === 'show' && (
        <TermsModal onAgree={submit} onDisagree={() => setTermsStatus(null)} />
      )}

      {!user.account && (
        <Localized id="thanks-for-account">
          <p />
        </Localized>
      )}

      <Localized id="why-profile-text">
        <p />
      </Localized>

      <ExpandableInformation summaryLocalizedId="why-demographic">
        <Localized id="why-demographic-explanation-2">
          <div />
        </Localized>
      </ExpandableInformation>

      <div className="form-fields">
        <Localized id="profile-form-username" attrs={{ label: true }}>
          <LabeledInput
            value={username}
            onChange={handleChangeFor('username')}
            name="username"
          />
        </Localized>

        <Localized id="leaderboard-visibility" attrs={{ label: true }}>
          <LabeledSelect
            value={visible.toString()}
            onChange={handleChangeFor('visible')}
            name="leaderboard visibility">
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
          <LabeledSelect
            value={age}
            onChange={handleChangeFor('age')}
            name="age">
            <Options>{AGES}</Options>
          </LabeledSelect>
        </Localized>

        <Localized id="profile-form-gender-2" attrs={{ label: true }}>
          <LabeledSelect
            value={gender}
            onChange={handleChangeFor('gender')}
            name="gender">
            <Options>{GENDERS}</Options>
          </LabeledSelect>
        </Localized>
      </div>

      <ExpandableInformation summaryLocalizedId="help-sex-or-gender-changes">
        <Localized
          id="help-sex-or-gender-changes-explanation"
          elems={{
            learnMoreLink: (
              <a
                href="https://foundation.mozilla.org/en/blog/expanding-gender-options-on-common-voice/"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              />
            ),
          }}>
          <div />
        </Localized>
      </ExpandableInformation>

      <ProfileInfoLanguages
        userLanguages={userLanguages}
        setUserLanguages={setUserLanguages}
        areLanguagesLoading={areLanguagesLoading}
        setAreLanguagesLoading={setAreLanguagesLoading}
      />

      <Hr />

      {!user.account?.basket_token && (
        <>
          <div className="signup-section">
            <Tooltip
              arrow
              html={<>{getString('change-email-setings')}</>}
              theme="dark">
              <Localized id="email-input" attrs={{ label: true }}>
                <LabeledInput value={user.userClients[0]?.email} disabled />
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
                name="email-opt-in"
              />

              <LabeledCheckbox
                {...(user.account || isSubmitted ? { disabled: true } : {})}
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
                name="privacy"
              />

              <Localized id="read-terms-q">
                <LocaleLink
                  to={isEnrolledInChallenge ? URLS.CHALLENGE_TERMS : URLS.TERMS}
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
          disabled={isSaving || !privacyAgreed || areLanguagesLoading}
          onClick={submit}
        />
      </Localized>
    </div>
  )
}

export default withLocalization(withRouter(ProfileInfo))
