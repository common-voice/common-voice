import React, { useReducer } from 'react'
import { useDispatch } from 'react-redux'
import { useLocalization } from '@fluent/react'

import { AlertIcon, CheckIcon } from '../../../../../../ui/icons'

import { sentenceWriteReducer } from '../sentence-write.reducer'
import { SentenceSubmission, SentenceSubmissionError } from 'common'

import { useAction } from '../../../../../../../hooks/store-hooks'
import { useLocale } from '../../../../../../locale-helpers'

import { Sentences } from '../../../../../../../stores/sentences'
import { Notifications } from '../../../../../../../stores/notifications'
import { WriteMode } from '..'
import { SentenceWriteActionType, SentenceWriteState } from '../types'

const initialState: SentenceWriteState = {
  sentence: '',
  citation: '',
  sentenceDomains: [],
  sentenceVariant: '',
  error: undefined,
  confirmPublicDomain: false,
}

const allVariantToken = 'sentence-variant-select-multiple-variants'
const MAX_SMALL_BATCH_SENTENCES_LENGTH = 1000
export const SMALL_BATCH_KEY = 'small-batch-responses'

const newLineRegex = /\r|\n/

export const useSentenceWrite = (mode: WriteMode) => {
  const [state, sentenceWriteDispatch] = useReducer(
    sentenceWriteReducer,
    initialState
  )

  const { l10n } = useLocalization()
  const dispatch = useDispatch()

  const createSentence = useAction(Sentences.actions.create)

  const addNotification = <T extends object>({
    message,
    type,
    icon,
  }: {
    message: string
    type: Notifications.NotificationType
    icon?: React.ComponentType<T>
  }) => {
    dispatch(Notifications.actions.addPill(message, type, icon))
  }

  const [currentLocale] = useLocale()

  const handlePublicDomainChange = () => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.SET_PUBLIC_DOMAIN,
    })
  }

  const handleSentenceInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.SET_SENTENCE,
      payload: { sentence: event.target.value },
    })
  }

  const handleCitationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.SET_CITATION,
      payload: { citation: event.target.value },
    })
  }

  const handleSentenceDomainChange = (domain: string[]) => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.SET_DOMAIN,
      payload: { sentenceDomains: domain },
    })
  }

  const handleSentenceVariantChange = (item: string) => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.SET_VARIANT,
      payload: { sentenceVariant: item },
    })
  }

  const dispatchError = <T extends object>(
    errorType: SentenceSubmissionError,
    messageKey?: string,
    icon?: React.ComponentType<T>
  ) => {
    sentenceWriteDispatch({
      type: SentenceWriteActionType.ADD_SENTENCE_ERROR,
      payload: { error: errorType },
    })

    if (messageKey) {
      addNotification({
        message: l10n.getString(messageKey),
        type: 'error',
        ...(icon && { icon }),
      })
    }
  }

  const isSentenceValid = (sentenceSubmission: SentenceSubmission): boolean => {
    const hasMultipleSentences = newLineRegex.exec(sentenceSubmission.sentence)
    const smallBatchSentencesLength =
      sentenceSubmission.sentence.split('\n').length

    if (!sentenceSubmission.source) {
      dispatchError(SentenceSubmissionError.NO_CITATION)
      return false
    }

    if (mode === 'single' && hasMultipleSentences) {
      dispatchError(
        SentenceSubmissionError.MULTIPLE_SENTENCES,
        'multiple-sentences-error'
      )
      return false
    }

    if (
      mode === 'small-batch' &&
      smallBatchSentencesLength > MAX_SMALL_BATCH_SENTENCES_LENGTH
    ) {
      dispatchError(
        SentenceSubmissionError.EXCEEDS_SMALL_BATCH_LIMIT,
        'exceeds-small-batch-limit-error',
        AlertIcon
      )
      return false
    }

    return true
  }

  const handleSubmit = async (evt: React.SyntheticEvent) => {
    evt.preventDefault()

    const newSentence: SentenceSubmission = {
      sentence: state.sentence,
      source: state.citation,
      localeName: currentLocale,
      domains: state.sentenceDomains,
      ...(state.sentenceVariant.length > 0 &&
        state.sentenceVariant !== allVariantToken && {
          variant: state.sentenceVariant,
        }),
    }

    if (!isSentenceValid(newSentence)) return

    try {
      const response =
        mode === 'single'
          ? await createSentence({ sentenceSubmission: newSentence })
          : await createSentence({
              sentenceSubmission: newSentence,
              isSmallBatch: true,
            })

      addNotification({
        message:
          mode === 'single'
            ? l10n.getString('add-sentence-success')
            : l10n.getString('add-small-batch-success', {
                uploadedSentences: response.valid_sentences_count,
                totalSentences: response.total_count,
              }),
        type: response?.valid_sentences_count === 0 ? 'error' : 'success',
        icon: response?.valid_sentences_count === 0 ? AlertIcon : CheckIcon,
      })

      const smallBatchResponse = {
        totalCount: response?.total_count,
        validSentencesCount: response?.valid_sentences_count,
        invalidSentences: response?.invalid_sentences,
      }

      if (response.invalid_sentences) {
        localStorage.setItem(
          SMALL_BATCH_KEY,
          JSON.stringify(smallBatchResponse)
        )
      }

      sentenceWriteDispatch({
        type: SentenceWriteActionType.ADD_SENTENCE_SUCCESS,
        ...(response.invalid_sentences && {
          payload: { smallBatchResponse },
        }),
      })
    } catch (error) {
      const errorMessage = JSON.parse(error.message)
      dispatchError(errorMessage.errorType, 'add-sentence-error')
    }
  }

  return {
    handleCitationChange,
    handlePublicDomainChange,
    handleSentenceDomainChange,
    handleSentenceInputChange,
    handleSentenceVariantChange,
    handleSubmit,
    sentenceWriteState: state,
  }
}
