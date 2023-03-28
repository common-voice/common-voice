import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { QuestionIcon, SendIcon } from '../../../ui/icons';
import { Button, LabeledCheckbox, LinkButton } from '../../../ui/ui';
import URLS from '../../../../urls';
import { PrimaryButton } from '../../../primary-buttons/primary-buttons';
import { useLocale } from '../../../locale-helpers';

import './write.css';
import { SentenceInputAndRules } from './sentence-input-and-rules/sentence-input-and-rules';
import { Sentences } from '../../../../stores/sentences';
import { SentenceSubmission, SentenceSubmissionError } from 'common';
import { useTypedSelector } from '../../../../stores/tree';
import { Notifications } from '../../../../stores/notifications';
import { useAction } from '../../../../hooks/store-hooks';

export type WriteProps = WithLocalizationProps;

const Write: React.FC<WriteProps> = ({ getString }) => {
  const [confirmPublicDomain, setConfirmPublicDomain] = useState(false);
  const [sentence, setSentence] = useState('');
  const [citation, setCitation] = useState('');
  const [error, setError] = useState<SentenceSubmissionError>();

  const [currentLocale] = useLocale();
  const languages = useTypedSelector(({ languages }) => languages);

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id;

  const dispatch = useDispatch();

  const createSentence = useAction(Sentences.actions.create);

  const addNotification = ({
    message,
    type,
  }: {
    message: string;
    type: Notifications.NotificationType;
  }) => {
    dispatch(Notifications.actions.addPill(message, type));
  };

  const handlePublicDomainChange = () => {
    setConfirmPublicDomain(!confirmPublicDomain);
  };

  const handleSentenceInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSentence(event.target.value);
  };

  const handleCitationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCitation(event.target.value);
  };

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    const newSentence: SentenceSubmission = {
      sentence,
      source: citation,
      localeId,
      localeName: currentLocale,
    };

    try {
      await createSentence(newSentence);
      console.log('here >>');

      addNotification({
        message: getString('add-sentence-success'),
        type: 'success',
      });
      console.log('here after>>');

      // reset input fields after submission
      setSentence('');
      setCitation('');
      setConfirmPublicDomain(false);
      setError(undefined);
    } catch (error) {
      console.log({ error });
      // const errorMessage = JSON.parse(error.message)
      // console.log({ errorMessage })
      // setError(errorMessage.errorType)
      addNotification({
        message: getString('add-sentence-error'),
        type: 'error',
      });
    }
  };

  return (
    <div className="write-page">
      <div className="write-wrapper">
        <div className="write">
          <div className="inputs-and-rules-container">
            <SentenceInputAndRules
              getString={getString}
              handleSentenceInputChange={handleSentenceInputChange}
              handleCitationChange={handleCitationChange}
              sentence={sentence}
              citation={citation}
              error={error}
            />
          </div>

          <div className="buttons">
            <div>
              <LinkButton
                rounded
                outline
                className="hidden-sm-down guidelines-button"
                blank
                to={URLS.SPEAK}>
                <QuestionIcon />
                <Localized id="guidelines">
                  <span />
                </Localized>
              </LinkButton>
              <Button
                rounded
                outline
                className="hidden-sm-down"
                // TODO: remove this
                onClick={() => console.log('sksksk')}>
                <SendIcon />
                <Localized id="contact-us">
                  <span />
                </Localized>
              </Button>
            </div>
            <div className="write-form-container">
              <form
                className="guidelines-form"
                data-testid="guidelines-form"
                onSubmit={handleSubmit}>
                <LabeledCheckbox
                  label={
                    <Localized
                      id="sc-submit-confirm"
                      elems={{
                        wikipediaLink: (
                          <a
                            href="https://en.wikipedia.org/wiki/Public_domain"
                            target="_blank"
                            rel="noreferrer"
                          />
                        ),
                      }}>
                      <span />
                    </Localized>
                  }
                  disabled={sentence.length === 0 || citation.length === 0}
                  checked={confirmPublicDomain}
                  required
                  onChange={handlePublicDomainChange}
                  data-testid="checkbox"
                />
                <Localized id="submit-form-action">
                  <PrimaryButton
                    className="submit"
                    type="submit"
                    disabled={!confirmPublicDomain}
                  />
                </Localized>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLocalization(Write);
