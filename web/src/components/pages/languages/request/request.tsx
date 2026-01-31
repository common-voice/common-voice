import * as React from 'react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Localized } from '@fluent/react'

import { 
  useToLocaleRoute, 
  useAvailableLocales, 
  useNativeLocaleNames,
  useContributableLocales,
  useAllLocales,
  useEnglishLocaleNames,
  useSpontaneousSpeechLocales
} from '../../../locale-helpers'
import { useAPI } from '../../../../hooks/store-hooks'
import URLS from '../../../../urls'
import {
  LabeledCheckbox,
  LabeledInput,
  LabeledTextArea,
  StyledLink,
  Button,
} from '../../../ui/ui'
import Toggle from './toggle'
import ExpandableInformation from '../../../expandable-information/expandable-information'
import PageHeading from '../../../ui/page-heading'
import ErrorPage from '../../error-page/error-page'
import PageTextContent from '../../../ui/page-text-content'
import Page from '../../../ui/page'
import ClientLogger from '../../../../logger'
import { trackGtag } from '../../../../services/tracker-ga4'
import { LanguageSearch } from '../languages'

const logger = new ClientLogger({ name: 'LanguagesRequestFormPage' })

const EMAIL_ADDRESS = 'commonvoice@mozilla.com'

import './request.css'

const LanguagesRequestFormPage = () => {
  const api = useAPI()
  const toLocaleRoute = useToLocaleRoute()
  const history = useHistory()
  const inputRef = React.createRef<HTMLInputElement>()

  const [isSendingRequest, setIsSendingRequest] = useState(false)
  const [hasGenericError, setHasGenericError] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [languageInfoValue, setLanguageInfoValue] = useState('')
  const [privacyAgreedChecked, setPrivacyAgreedChecked] = useState(false)
  const [scriptedSpeechToggled, setScriptedSpeechToggled] = useState(false)
  const [spontaneousSpeechToggled, setSpontaneousSpeechToggled] =
    useState(false)
  const [scriptedSpeechToggleDisabled, setScriptedSpeechToggleDisabled] = useState(false)
  const [spontaneousSpeechToggleDisabled, setSpontaneousSpeechToggleDisabled] =
    useState(false)
  const [language, setLanguage] = useState(undefined)
  const [languagesFiltered, setLanguagesFiltered] = useState(undefined)
  const [query, setQuery] = useState('')
  const [infoInputOpen, isInfoInputOpen] = useState(false)

  const noPlatformToggleOptionSelected =
    !scriptedSpeechToggled && !spontaneousSpeechToggled

  const isSubmitButtonDisabled =
    isSendingRequest || noPlatformToggleOptionSelected

  const platforms = [
    ...(scriptedSpeechToggled ? ['scripted-speech'] : []),
    ...(spontaneousSpeechToggled ? ['spontaneous-speech'] : []),
  ]

  const toggleSearch = () => {
    setQuery('');
    setLanguage(undefined)
  }

  const languages = useAllLocales()
  const nativeNames = useNativeLocaleNames()
  const englishNames = useEnglishLocaleNames()
  const availableLocales = useAvailableLocales()
  const contributableLocales = useContributableLocales()
  const spontaneousSpeechLocales = useSpontaneousSpeechLocales()

  const isContributable = (locale: string) => {
    return contributableLocales.includes(locale)
  }
  
  const isTranslated = (locale: string) => {
    return availableLocales.includes(locale)
  }

  const hasSpontaneousSpeech = (locale: string) => {
    return spontaneousSpeechLocales.includes(locale)
  }

  const submitAvailable = (locale: string) => {
    if (!languages.includes(locale) || !hasSpontaneousSpeech(locale)) {
      return true
    }
    return false
  }

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    nativeNames: any
  ) => {
    const query = event.target.value

    function filterLanguages<T>(languages: T[]): T[] {
      if(!query){setLanguage(undefined)}
      return query
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          languages.filter((locale : any) => {
            const q = query.toLowerCase().trim()
            return (
              locale.includes(q) ||
              locale.toLowerCase().includes(q) ||
              (nativeNames[locale] || '').toLowerCase().includes(q) ||
              (englishNames[locale] || '').toLowerCase().includes(q) 
            )
          })
        : languages
    }

    const filtered = filterLanguages(languages)
    setLanguagesFiltered(filtered)
    setQuery(query)
    if (filtered.length == 0) {setLanguage(undefined)}
  }

  const handleQueryKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      toggleSearch()
    }
  }

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailValue(event.target.value)
  }

  const handleLanguageInfoTextAreaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLanguageInfoValue(event.target.value)
  }

  const handlePrivacyAgreedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrivacyAgreedChecked(event.target.checked)
  }

  const isValidSubmissionData = () => {
    return (
      privacyAgreedChecked === true &&
      emailValue.trim().length !== 0 &&
      languageInfoValue.trim().length !== 0
    )
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // don't submit if we're sending a request
    if (isSendingRequest) {
      return
    }

    if (!isValidSubmissionData()) {
      return
    }

    setIsSendingRequest(true)
    try {
      await api.sendLanguageRequest({
        email: emailValue.trim(),
        languageInfo: languageInfoValue.trim(),
        languageLocale: navigator?.language,
        platforms,
      })

      trackGtag('request-language', { platforms })

      // redirect to languages/success path if email sent correctly
      history.push(toLocaleRoute(URLS.LANGUAGE_REQUEST_SUCCESS))
    } catch (e) {
      logger.error(e)
      setIsSendingRequest(false)

      setHasGenericError(true)
      window.scrollTo({ top: 0 })
    }
    setIsSendingRequest(false)
  }

  if (hasGenericError) {
    return (
      <ErrorPage errorCode="500" prevPath={URLS.LANGUAGE_REQUEST}>
        <Localized
          id="request-language-error"
          elems={{
            emailLink: <StyledLink href={`mailto:${EMAIL_ADDRESS}`} />,
          }}
          vars={{ email: EMAIL_ADDRESS }}>
          <p />
        </Localized>
      </ErrorPage>
    )
  }

  return (
    <Page className="languages-request-page">
      <div className="languages-request-page-wrapper">
        <div className="languages-request-page__content">
          <PageHeading>
            <Localized id="request-language-heading" />
          </PageHeading>

          <PageTextContent>
            <Localized
              id="request-language-explanation-1"
              elems={{
                languagesPageLink: <StyledLink to={URLS.LANGUAGES} />,
                strong: <strong />,
              }}>
              <p />
            </Localized>
          </PageTextContent>

          <form
            className="languages-request-page__content__form"
            onSubmit={handleSubmit}>
            
            <Localized
              id="request-language-search-bar">
            </Localized>
            <LanguageSearch
                inputRef={inputRef}
                query={query}
                handleQueryChange={e => handleQueryChange(e, nativeNames)}
                handleQueryKeyDown={handleQueryKeyDown}
                toggleSearch={toggleSearch}
            />
            
            {(query !== '' && languagesFiltered.length !== 0) ? <span className="dropdown_menu">
              {languagesFiltered?.map((locale: string) => (
                <div className="dropdown_item_container"
                  key={locale}
                >
                  <span className="dropdown_item"
                    title={englishNames[locale]}
                    tabIndex={0}
                    onClick={() => {
                      setLanguage(locale); 
                      setQuery(englishNames[locale]); 
                      setLanguagesFiltered([locale]);
                      if(!languages.includes(locale)) {
                        setScriptedSpeechToggled(true)
                      } else {setScriptedSpeechToggleDisabled(true)}
                      if(!hasSpontaneousSpeech(locale)) {
                        setSpontaneousSpeechToggled(true)
                      } else {setSpontaneousSpeechToggleDisabled(true)}
                    }}
                  >
                    {englishNames[locale]}
                    {/* {language && language === locale && (
                      <span className="styled_check"/>
                    )} */}
                  </span>
                </div>
              ))}
              </span> : <div />
            }
            
            <p />
            {language ? (
              <div>
              {isContributable(language) ? 
                (
                    <Localized id="request-language-found-cv-contribution"
                      elems={{
                        homePageLink: <StyledLink href={`https://commonvoice.mozilla.org/${language}`} />,
                        strong: <strong />
                      }}>
                      <p/>
                    </Localized>
                ) : isTranslated(language) ? 
                    <Localized id="request-language-found-cv-sentences-lack"
                      elems={{
                        sentencesContributionLink: <StyledLink href={`https://commonvoice.mozilla.org/${language}/write`} />,
                        strong: <strong />
                      }}>
                      <p/>
                    </Localized>
                    :
                    <Localized id="request-language-found-pontoon-not-launched"
                      elems={{
                        pontoonLink: <StyledLink href={`https://pontoon.mozilla.org/${language}/common-voice/`} />,
                        strong: <strong />
                      }}>
                      <p/>
                    </Localized>
              }
              {hasSpontaneousSpeech(language) ? 
                (
                  <Localized id="request-language-found-spontaneous-speech"
                  elems={{
                        spontaneousSpeechLink: <StyledLink href={"https://commonvoice.mozilla.org/spontaneous-speech/beta/prompts"} />,
                        strong: <strong />
                    }}>
                    <p/>
                  </Localized>
                ) : <div/>
              }
              </div>
            ) : <div/>}
          <p/>
          {(query !== '' && (languagesFiltered.length == 0 || (language && submitAvailable(language))) ? (
            <span>
              <p className="languages-request-page__content__form__required">
                <Localized id="indicates-required" />
              </p>

              <Localized id="request-language-form-email" attrs={{ label: true }}>
                <LabeledInput
                  value={emailValue}
                  onChange={handleEmailInputChange}
                  required
                  type="email"
                />
              </Localized>

              <div className="toggles-container">
                <Toggle
                  label="request-for-scripted-speech-toggle"
                  checked={scriptedSpeechToggled}
                  onToggle={setScriptedSpeechToggled}
                  disabled={scriptedSpeechToggleDisabled}
                />
                <div className="hr" />
                <Toggle
                  label="request-for-spontaneous-speech-toggle"
                  checked={spontaneousSpeechToggled}
                  onToggle={setSpontaneousSpeechToggled}
                  disabled={spontaneousSpeechToggleDisabled}
                />
                <div className="hr" />
                <ExpandableInformation summaryLocalizedId="need-help-deciding-platform">
                  <Localized
                    id="need-help-deciding-platform-explanation-1"
                    elems={{ strong: <strong /> }}>
                    <p />
                  </Localized>
                  <Localized
                    id="need-help-deciding-platform-explanation-2"
                    elems={{ strong: <strong /> }}>
                    <p />
                  </Localized>
                  <Localized id="need-help-deciding-platform-explanation-3">
                    <p />
                  </Localized>
                </ExpandableInformation>
              </div>

              <PageTextContent>
                <p>
                  <Localized id="request-language-form-info-explanation" />
                </p>

                <ul>
                  <li>
                    <Localized id="request-language-form-info-explanation-list-1" />
                  </li>
                  <Localized
                    id="request-language-form-info-explanation-list-2"
                    elems={{
                      isoCodeLink: (
                        <StyledLink href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" />
                      ),
                    }}>
                    <li />
                  </Localized>
                  <li>
                    <Localized id="request-language-form-info-explanation-list-3" />
                  </li>
                </ul>
              </PageTextContent>

                <span>
                <Localized id="request-language-form-info" attrs={{ label: true }}>
                  <LabeledTextArea
                    className="languages-request-page__content__form__text-area"
                    value={languageInfoValue}
                    onChange={handleLanguageInfoTextAreaChange}
                    required
                  />
                </Localized>


                <LabeledCheckbox
                  label={
                    <Localized
                      id="accept-privacy"
                      elems={{ privacyLink: <StyledLink to={URLS.PRIVACY} /> }}>
                      <span />
                    </Localized>
                  }
                  checked={privacyAgreedChecked}
                  onChange={handlePrivacyAgreedChange}
                  required
                />

                <Localized id="submit-form-action">
                  <Button
                    type="submit"
                    rounded
                    isBig
                    outline={false}
                    disabled={isSubmitButtonDisabled}
                    className="request-language-btn"
                    data-testid="request-language-btn"
                  />
                </Localized>
              </span>
            </span>
            ) : <div />)
            }
          </form>
        </div>

        <div className="languages-request-page__image">
          <img
            src={require('./images/mars-request.svg')}
            alt=""
            loading="lazy"
            role="presentation"
          />
        </div>
      </div>
    </Page>
  )
}

export default LanguagesRequestFormPage;
