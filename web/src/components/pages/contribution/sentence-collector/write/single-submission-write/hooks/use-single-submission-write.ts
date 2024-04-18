import { useReducer } from 'react'
import { useDispatch } from 'react-redux'
import { useLocalization } from '@fluent/react'

import {
  SingleSubmissionWriteActionType,
  SingleSubmissionWriteState,
  singleSubmissionWriteReducer,
} from '../single-submission-write.reducer'
import { SentenceSubmission, SentenceSubmissionError } from 'common'

import { useAction, useLanguages } from '../../../../../../../hooks/store-hooks'
import { useLocale } from '../../../../../../locale-helpers'

import { Sentences } from '../../../../../../../stores/sentences'
import { Notifications } from '../../../../../../../stores/notifications'

const initialState: SingleSubmissionWriteState = {
  sentence: '',
  citation: '',
  sentenceDomains: [],
  sentenceVariant: '',
  error: undefined,
  confirmPublicDomain: false,
}

const allVariantToken = 'sentence-variant-select-all-variants'

export const useSingleSubmissionWrite = () => {
  const [state, singleSubmissionWriteDispatch] = useReducer(
    singleSubmissionWriteReducer,
    initialState
  )

  const { l10n } = useLocalization()

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

  const [currentLocale] = useLocale()
  const languages = useLanguages()

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id

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

  const handleSentenceDomainChange = (domain: string[]) => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_SENTENCE_DOMAIN,
      payload: { sentenceDomains: domain },
    })
  }

  const handleSentenceVariantChange = (item: string) => {
    singleSubmissionWriteDispatch({
      type: SingleSubmissionWriteActionType.SET_SENTENCE_VARIANT,
      payload: { sentenceVariant: item },
    })
  }

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    const newSentence: SentenceSubmission = {
      sentence: state.sentence,
      source: state.citation,
      localeName: currentLocale,
      localeId,
      domains: state.sentenceDomains,
      ...(state.sentenceVariant.length > 0 &&
        state.sentenceVariant !== allVariantToken && {
          variant: state.sentenceVariant,
        }),
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
          message: l10n.getString('add-sentence-success'),
          type: 'success',
        })

        singleSubmissionWriteDispatch({
          type: SingleSubmissionWriteActionType.ADD_SENTENCE_SUCCESS,
        })
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message)

      singleSubmissionWriteDispatch({
        type: SingleSubmissionWriteActionType.ADD_SENTENCE_ERROR,
        payload: { error: errorMessage.errorType },
      })

      addNotification({
        message: l10n.getString('add-sentence-error'),
        type: 'error',
      })
    }
  }

  return {
    handleCitationChange,
    handlePublicDomainChange,
    handleSentenceDomainChange,
    handleSentenceInputChange,
    handleSentenceVariantChange,
    handleSubmit,
    singleSentenceSubmissionState: state,
  }
}
