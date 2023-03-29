import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import React, { useReducer } from 'react';
import { useDispatch } from 'react-redux';

import { QuestionIcon, SendIcon } from '../../../ui/icons';
import { Button, LabeledCheckbox, LinkButton } from '../../../ui/ui';
import URLS from '../../../../urls';
import { PrimaryButton } from '../../../primary-buttons/primary-buttons';
import { useLocale } from '../../../locale-helpers';

import { SentenceInputAndRules } from './sentence-input-and-rules/sentence-input-and-rules';
import { Sentences } from '../../../../stores/sentences';
import { SentenceSubmission, SentenceSubmissionError } from 'common';
import { useTypedSelector } from '../../../../stores/tree';
import { Notifications } from '../../../../stores/notifications';
import { useAction } from '../../../../hooks/store-hooks';
import { WriteActionType, writeReducer, WriteState } from './write.reducer';

import './write.css';

export type WriteProps = WithLocalizationProps;

const initialState: WriteState = {
  sentence: '',
  citation: '',
  error: undefined,
  confirmPublicDomain: false,
};

const Write: React.FC<WriteProps> = ({ getString }) => {
  const [state, writeDispatch] = useReducer(writeReducer, initialState);

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
    writeDispatch({ type: WriteActionType.SET_PUBLIC_DOMAIN });
  };

  const handleSentenceInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    writeDispatch({
      type: WriteActionType.SET_SENTENCE,
      payload: { sentence: event.target.value },
    });
  };

  const handleCitationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    writeDispatch({
      type: WriteActionType.SET_CITATION,
      payload: { citation: event.target.value },
    });
  };

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    const newSentence: SentenceSubmission = {
      sentence: state.sentence,
      source: state.citation,
      localeId,
      localeName: currentLocale,
    };

    try {
      if (!state.citation) {
        writeDispatch({
          type: WriteActionType.ADD_SENTENCE_ERROR,
          payload: { error: SentenceSubmissionError.NO_CITATION },
        });
      } else {
        await createSentence(newSentence);

        addNotification({
          message: getString('add-sentence-success'),
          type: 'success',
        });

        writeDispatch({ type: WriteActionType.ADD_SENTENCE_SUCCESS });
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message);

      writeDispatch({
        type: WriteActionType.ADD_SENTENCE_ERROR,
        payload: { error: errorMessage.errorType },
      });
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
              sentence={state.sentence}
              citation={state.citation}
              error={state.error}
            />
          </div>

          <div className="buttons">
            <div>
              <LinkButton
                rounded
                outline
                className="guidelines-button"
                blank
                // TODO: update this to guidelines url
                to={URLS.SPEAK}>
                <QuestionIcon />
                <Localized id="guidelines">
                  <span />
                </Localized>
              </LinkButton>
              <Button
                rounded
                outline
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
                  disabled={state.sentence.length === 0}
                  checked={state.confirmPublicDomain}
                  required
                  onChange={handlePublicDomainChange}
                  data-testid="checkbox"
                />
                <Localized id="submit-form-action">
                  <PrimaryButton
                    className="submit"
                    type="submit"
                    disabled={!state.confirmPublicDomain}
                  />
                </Localized>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withLocalization(Write);
