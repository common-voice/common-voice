import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'
import { useDispatch } from 'react-redux'

import { QuestionIcon, SendIcon } from '../../../../../ui/icons'
import { LabeledCheckbox, LinkButton } from '../../../../../ui/ui'
import URLS from '../../../../../../urls'
import { PrimaryButton } from '../../../../../primary-buttons/primary-buttons'
import { useLocale } from '../../../../../locale-helpers'

import { SentenceInputAndRules } from '../sentence-input-and-rules/sentence-input-and-rules'
import { Sentences } from '../../../../../../stores/sentences'
import {
  SentenceDomain,
  SentenceSubmission,
  SentenceSubmissionError,
} from 'common'
import { Notifications } from '../../../../../../stores/notifications'
import { useAction, useLanguages } from '../../../../../../hooks/store-hooks'
import {
  SingleSubmissionWriteActionType,
  singleSubmissionWriteReducer,
  SingleSubmissionWriteState,
} from './single-submission-write.reducer'

import { COMMON_VOICE_EMAIL } from '../../../../../../constants'

import { trackSingleSubmission } from '../../../../../../services/tracker'

import './single-submission-write.css'

export type SingleSubmissionWriteProps = WithLocalizationProps

const initialState: SingleSubmissionWriteState = {
  sentence: '',
  citation: '',
  sentenceDomain: undefined,
  error: undefined,
  confirmPublicDomain: false,
}

const SingleSubmissionWrite: React.FC<SingleSubmissionWriteProps> = ({
  getString,
}) => {
  const [state, singleSubmissionWriteDispatch] = React.useReducer(
    singleSubmissionWriteReducer,
    initialState
  )

  const [currentLocale] = useLocale()
  const languages = useLanguages()

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id

  const dispatch = useDispatch()

  const createSentence = useAction(Sentences.actions.create)

  const addNotification = ({
    message,
    type,
  }: {
    message: string
    type: Notifications.NotificationType
  }) => {
    dispatch(Notifications.actions.addPill(message, type))
  }

  const handlePublicDomainChange = () => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_PUBLIC_DOMAIN,
    })
  }

  const handleSentenceInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_SENTENCE,
      payload: { sentence: event.target.value },
    })
  }

  const handleCitationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_CITATION,
      payload: { citation: event.target.value },
    })
  }

  const handleSentenceDomainChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_SENTENCE_DOMAIN,
      payload: { sentenceDomain: event.target.value as SentenceDomain },
    })
  }

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    const newSentence: SentenceSubmission = {
      sentence: state.sentence,
      source: state.citation,
      localeId,
      localeName: currentLocale,
      domain: state.sentenceDomain,
    }

    try {
      if (!state.citation) {
        singleSubmissionWriteDispatch({
          type: SingleSubmissionWriteActionType.ADD_SENTENCE_ERROR,
          payload: { error: SentenceSubmissionError.NO_CITATION },
        })
      } else {
        await createSentence(newSentence)

        addNotification({
          message: getString('add-sentence-success'),
          type: 'success',
        })

        singleSubmissionWriteDispatch({
          type: SingleSubmissionWriteActionType.ADD_SENTENCE_SUCCESS,
        })

        trackSingleSubmission('submit', currentLocale)
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message)

      singleSubmissionWriteDispatch({
        type: SingleSubmissionWriteActionType.ADD_SENTENCE_ERROR,
        payload: { error: errorMessage.errorType },
      })
      addNotification({
        message: getString('add-sentence-error'),
        type: 'error',
      })
    }
  }

  return (
    <form
      className="guidelines-form"
      data-testid="single-submission-form"
      onSubmit={handleSubmit}>
      <div className="inputs-and-rules-container">
        <SentenceInputAndRules
          getString={getString}
          handleSentenceInputChange={handleSentenceInputChange}
          handleCitationChange={handleCitationChange}
          handleSentenceDomainChange={handleSentenceDomainChange}
          sentence={state.sentence}
          citation={state.citation}
          sentenceDomain={state?.sentenceDomain}
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
            to={URLS.GUIDELINES}>
            <QuestionIcon />
            <Localized id="guidelines">
              <span />
            </Localized>
          </LinkButton>
          <LinkButton
            rounded
            outline
            blank
            href={`mailto:${COMMON_VOICE_EMAIL}`}>
            <SendIcon />
            <Localized id="contact-us">
              <span />
            </Localized>
          </LinkButton>
        </div>
        <div className="write-form-container">
          <LabeledCheckbox
            label={
              <Localized
                id="sc-write-submit-confirm"
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
            data-testid="public-domain-checkbox"
          />
          <Localized id="submit-form-action">
            <PrimaryButton
              className="submit"
              type="submit"
              disabled={!state.confirmPublicDomain}
              data-testid="submit-button"
            />
          </Localized>
        </div>
      </div>
    </form>
  )
}

export default withLocalization(SingleSubmissionWrite)
