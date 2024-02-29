import { useDispatch } from 'react-redux'
import { FluentVariable } from '@fluent/bundle'

import {
  useAction,
  useLanguages,
  useSentences,
} from '../../../../../hooks/store-hooks'
import { useLocale } from '../../../../locale-helpers'
import { Sentences } from '../../../../../stores/sentences'
import { Notifications } from '../../../../../stores/notifications'
import { trackSingleReview } from '../../../../../services/tracker'

const TOO_MANY_REQUESTS_ERROR = 'Too Many Requests'

type UseReviewParams = {
  getString: (
    id: string,
    args?: Record<string, FluentVariable> | null,
    fallback?: string
  ) => string
  showReportModal: boolean
}

const useReview = ({ getString, showReportModal }: UseReviewParams) => {
  const dispatch = useDispatch()

  const sentences = useSentences()
  const [currentLocale] = useLocale()
  const languages = useLanguages()

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  const activeSentenceIndex = pendingSentencesSubmissions.findIndex(
    el => el.isValid === null
  )

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id

  const voteSentence = useAction(Sentences.actions.voteSentence)
  const skipSentence = useAction(Sentences.actions.skipSentence)
  const fetchPendingSentences = useAction(
    Sentences.actions.refillPendingSentences
  )

  const handleFetch = () => {
    try {
      fetchPendingSentences(localeId)
    } catch (error) {
      dispatch(
        Notifications.actions.addPill(
          getString('sentences-fetch-error'),
          'error'
        )
      )
      console.error(error)
    }
  }

  const handleError = ({
    error,
    errorMessage,
    sentenceId,
  }: {
    error: string
    errorMessage: string
    sentenceId: string
  }) => {
    if (error.toString().includes(TOO_MANY_REQUESTS_ERROR)) {
      dispatch(
        Notifications.actions.addPill(
          getString('review-error-rate-limit-exceeded'),
          'error'
        )
      )
    } else {
      dispatch(Sentences.actions.showNextSentence(sentenceId))
      dispatch(Notifications.actions.addPill(getString(errorMessage), 'error'))
    }
  }

  const handleVoteYes = async () => {
    const sentenceId =
      pendingSentencesSubmissions[activeSentenceIndex].sentenceId

    try {
      await voteSentence({
        vote: true,
        sentence_id: sentenceId,
        sentenceIndex: activeSentenceIndex,
      })

      dispatch(Notifications.actions.addPill(getString('vote-yes'), 'success'))
      trackSingleReview('vote-yes', currentLocale)
    } catch (error) {
      handleError({
        error: error.toString(),
        errorMessage: 'review-error',
        sentenceId,
      })
    }
  }

  const handleVoteNo = async () => {
    const sentenceId =
      pendingSentencesSubmissions[activeSentenceIndex].sentenceId

    try {
      await voteSentence({
        vote: false,
        sentence_id: sentenceId,
        sentenceIndex: activeSentenceIndex,
      })

      dispatch(Notifications.actions.addPill(getString('vote-no'), 'success'))
      trackSingleReview('vote-no', currentLocale)
    } catch (error) {
      handleError({
        error: error.toString(),
        errorMessage: 'review-error',
        sentenceId,
      })
    }
  }

  const handleSkip = async () => {
    const sentenceId =
      pendingSentencesSubmissions[activeSentenceIndex].sentenceId

    try {
      await skipSentence(sentenceId)

      dispatch(
        Notifications.actions.addPill(
          getString('sc-review-form-button-skip'),
          'success'
        )
      )
      trackSingleReview('skip', currentLocale)
    } catch (error) {
      handleError({
        error: error.toString(),
        errorMessage: 'review-error',
        sentenceId,
      })
    }
  }

  const reviewShortCuts = [
    {
      key: 'sc-review-form-button-approve-shortcut',
      label: 'vote-yes',
      action: () => {
        handleVoteYes()
      },
    },
    {
      key: 'sc-review-form-button-reject-shortcut',
      label: 'vote-no',
      action: () => {
        handleVoteNo()
      },
    },
    {
      key: 'sc-review-form-button-skip-shortcut',
      label: 'sc-review-form-button-skip',
      action: () => {
        handleSkip()
      },
    },
  ]

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (
      evt.ctrlKey ||
      evt.altKey ||
      evt.shiftKey ||
      evt.metaKey ||
      showReportModal
    ) {
      return
    }

    const shortcut = reviewShortCuts.find(
      ({ key }) => getString(key).toLowerCase() === evt.key
    )

    if (!shortcut) return

    shortcut.action()
    evt.preventDefault()
  }

  return {
    handleFetch,
    handleVoteYes,
    handleVoteNo,
    handleSkip,
    handleKeyDown,
    reviewShortCuts,
  }
}

export default useReview
