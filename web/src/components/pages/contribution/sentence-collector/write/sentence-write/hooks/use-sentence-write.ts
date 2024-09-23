import { useReducer } from 'react'
import { useDispatch } from 'react-redux'
import { useLocalization } from '@fluent/react'

import {
  SentenceWriteActionType,
  SentenceWriteState,
  sentenceWriteReducer,
} from '../sentence-write.reducer'
import { SentenceSubmission, SentenceSubmissionError } from 'common'

import { useAction } from '../../../../../../../hooks/store-hooks'
import { useLocale } from '../../../../../../locale-helpers'

import { Sentences } from '../../../../../../../stores/sentences'
import { Notifications } from '../../../../../../../stores/notifications'
import { WriteMode } from '..'

const initialState: SentenceWriteState = {
  sentence: '',
  citation: '',
  sentenceDomains: [],
  sentenceVariant: '',
  error: undefined,
  confirmPublicDomain: false,
}

const allVariantToken = 'sentence-variant-select-multiple-variants'

const newLineRegex = /\r|\n/

export const useSentenceWrite = (mode: WriteMode) => {
  const [state, sentenceWriteDispatch] = useReducer(
    sentenceWriteReducer,
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

  const validateSentence = (sentenceSubmission: SentenceSubmission) => {
    const hasMultipleSentences = newLineRegex.exec(sentenceSubmission.sentence)

    if (!sentenceSubmission.source) {
      sentenceWriteDispatch({
        type: SentenceWriteActionType.ADD_SENTENCE_ERROR,
        payload: { error: SentenceSubmissionError.NO_CITATION },
      })

      return false
    }

    if (mode === 'single' && hasMultipleSentences) {
      sentenceWriteDispatch({
        type: SentenceWriteActionType.ADD_SENTENCE_ERROR,
        payload: { error: SentenceSubmissionError.MULTIPLE_SENTENCES },
      })

      addNotification({
        message: l10n.getString('multiple-sentences-error'),
        type: 'error',
      })

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

    try {
      if (validateSentence(newSentence)) {
        await createSentence(newSentence)

        addNotification({
          message: l10n.getString('add-sentence-success'),
          type: 'success',
        })

        sentenceWriteDispatch({
          type: SentenceWriteActionType.ADD_SENTENCE_SUCCESS,
        })
      }
    } catch (error) {
      const errorMessage = JSON.parse(error.message)

      sentenceWriteDispatch({
        type: SentenceWriteActionType.ADD_SENTENCE_ERROR,
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
    sentenceWriteState: state,
  }
}
