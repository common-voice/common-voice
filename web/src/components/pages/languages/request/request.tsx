import * as React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Localized } from '@fluent/react';

import { useToLocaleRoute } from '../../../locale-helpers';
import { useAPI } from '../../../../hooks/store-hooks';
import URLS from '../../../../urls';
import {
  LabeledCheckbox,
  LabeledInput,
  LabeledTextArea,
  StyledLink,
  Button,
} from '../../../ui/ui';
import PageHeading from '../../../ui/page-heading';
import ErrorPage from '../../error-page/error-page';
import PageTextContent from '../../../ui/page-text-content';
import Page from '../../../ui/page';
import ClientLogger from '../../../../logger';

const logger = new ClientLogger({ name: 'LanguagesRequestFormPage' });

import './request.css';
import { COMMON_VOICE_EMAIL } from '../../../../constants';

const LanguagesRequestFormPage = () => {
  const api = useAPI();
  const toLocaleRoute = useToLocaleRoute();
  const history = useHistory();

  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [hasGenericError, setHasGenericError] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [languageInfoValue, setLanguageInfoValue] = useState('');
  const [privacyAgreedChecked, setPrivacyAgreedChecked] = useState(false);

  const handleEmailInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailValue(event.target.value);
  };

  const handleLanguageInfoTextAreaChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLanguageInfoValue(event.target.value);
  };

  const handlePrivacyAgreedChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPrivacyAgreedChecked(event.target.checked);
  };

  const isValidSubmissionData = () => {
    return (
      privacyAgreedChecked === true &&
      emailValue.trim().length !== 0 &&
      languageInfoValue.trim().length !== 0
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // don't submit if we're sending a request
    if (isSendingRequest) {
      return;
    }

    if (!isValidSubmissionData()) {
      return;
    }

    setIsSendingRequest(true);
    try {
      await api.sendLanguageRequest({
        email: emailValue.trim(),
        languageInfo: languageInfoValue.trim(),
        languageLocale: navigator?.language,
      });

      // redirect to languages/success path if email sent correctly
      history.push(toLocaleRoute(URLS.LANGUAGE_REQUEST_SUCCESS));
    } catch (e) {
      logger.error(e);
      setIsSendingRequest(false);

      setHasGenericError(true);
      window.scrollTo({ top: 0 });
    }
    setIsSendingRequest(false);
  };

  if (hasGenericError) {
    return (
      <ErrorPage errorCode="500" prevPath={URLS.LANGUAGE_REQUEST}>
        <Localized
          id="request-language-error"
          elems={{
            emailLink: <StyledLink href={`mailto:${COMMON_VOICE_EMAIL}`} />,
          }}
          vars={{ email: COMMON_VOICE_EMAIL }}>
          <p />
        </Localized>
      </ErrorPage>
    );
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

            <Localized
              id="request-language-explanation-2"
              elems={{ strong: <strong /> }}>
              <p />
            </Localized>
          </PageTextContent>

          <form
            className="languages-request-page__content__form"
            onSubmit={handleSubmit}>
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
              <Button type="submit" rounded isBig disabled={isSendingRequest} />
            </Localized>
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
  );
};

export default LanguagesRequestFormPage;
