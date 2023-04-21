import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'
import { Tooltip } from 'react-tippy'
import { useDispatch } from 'react-redux'

import {
  KeyboardIcon,
  QuestionIcon,
  ReviewIcon,
  SkipIcon,
} from '../../../../ui/icons'
import { Button, LinkButton } from '../../../../ui/ui'
import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import { Instruction } from '../instruction'
import ReviewCard from './review-card'
import { VoteButton } from '../../listen/listen'
import { Rules } from '../write/sentence-input-and-rules/rules'
import { ReportButton } from '../../report/report'
import ReviewEmptyState from './review-empty-state'
import { Spinner } from '../../../../ui/ui'
import { ReportModal } from '../../report/report'
import ReviewShortcutsModal from './review-shortcuts-modal'

import {
  useAccount,
  useAction,
  useLanguages,
  useSentences,
} from '../../../../../hooks/store-hooks'
import { Sentences } from '../../../../../stores/sentences'
import { useLocale } from '../../../../locale-helpers'
import URLS from '../../../../../urls'
import { Notifications } from '../../../../../stores/notifications'

import { ReportModalProps } from '../../report/report'

import './review.css'

type Props = WithLocalizationProps

const Review: React.FC<Props> = ({ getString }) => {
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = React.useState(false)

  const dispatch = useDispatch()

  const [currentLocale] = useLocale()
  const languages = useLanguages()
  const account = useAccount()
  const sentences = useSentences()

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  const activeSentenceIndex = pendingSentencesSubmissions.findIndex(
    el => el.isValid === null
  )

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id

  const fetchPendingSentences = useAction(
    Sentences.actions.refillPendingSentences
  )
  const voteSentence = useAction(Sentences.actions.voteSentence)
  const skipSentence = useAction(Sentences.actions.skipSentence)

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

  const handleVoteYes = () => {
    voteSentence({
      vote: true,
      sentence_id: pendingSentencesSubmissions[activeSentenceIndex].sentenceId,
      sentenceIndex: activeSentenceIndex,
    })

    dispatch(Notifications.actions.addPill(getString('vote-yes'), 'success'))
  }

  const handleVoteNo = () => {
    voteSentence({
      vote: false,
      sentence_id: pendingSentencesSubmissions[activeSentenceIndex].sentenceId,
      sentenceIndex: activeSentenceIndex,
    })

    dispatch(Notifications.actions.addPill(getString('vote-no'), 'success'))
  }

  const handleSkip = () => {
    const sentenceId =
      pendingSentencesSubmissions[activeSentenceIndex].sentenceId

    skipSentence(sentenceId)
    dispatch(
      Notifications.actions.addPill(
        getString('sc-review-form-button-skip'),
        'success'
      )
    )
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

  const handleToggleShortcutsModal = () => {
    setShowShortcutsModal(!showShortcutsModal)
  }

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

  const isLoading = sentences[currentLocale]?.isLoadingPendingSentences

  const noPendingSentences =
    !isLoading && pendingSentencesSubmissions.length === 0

  const reportModalProps = {
    reasons: [
      'offensive-language',
      'grammar-or-spelling',
      'sc-different-language',
      'difficult-pronounce',
    ],
    kind: 'sentence' as ReportModalProps['kind'],
    id: pendingSentencesSubmissions[activeSentenceIndex]?.sentenceId,
  }

  React.useEffect(() => {
    handleFetch()
  }, [])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  if (!account) {
    try {
      sessionStorage.setItem('redirectURL', location.pathname)
    } catch (error) {
      console.warn(`A sessionStorage error occurred ${error.message}`)
    }

    window.location.href = '/login'
    return <Spinner />
  }

  if (isLoading) {
    return <Spinner />
  }

  if (noPendingSentences) {
    return (
      <SentenceCollectionWrapper dataTestId="review-page" type="review">
        <ReviewEmptyState />
      </SentenceCollectionWrapper>
    )
  }

  return (
    <SentenceCollectionWrapper dataTestId="review-page" type="review">
      {showShortcutsModal && (
        <ReviewShortcutsModal
          shortcuts={reviewShortCuts}
          toggleModalVisibility={handleToggleShortcutsModal}
        />
      )}

      {showReportModal && (
        <ReportModal
          onRequestClose={() => setShowReportModal(false)}
          onSubmitted={handleSkip}
          {...reportModalProps}
        />
      )}

      <div className="cards-and-instruction">
        <Instruction
          firstPartId="sc-review-instruction-first-part"
          secondPartId="sc-review-instruction-second-part"
          icon={<ReviewIcon />}
        />
        <div className="cards-and-guidelines">
          <div className="placeholder" />
          {pendingSentencesSubmissions.length > 0 && (
            <div className="cards">
              {pendingSentencesSubmissions.map((submission, index) => (
                <ReviewCard
                  sentence={submission.sentence}
                  source={submission.source}
                  key={submission.sentenceId}
                  isActive={index === activeSentenceIndex}
                  index={index}
                  activeSentenceIndex={activeSentenceIndex}
                />
              ))}
            </div>
          )}
          <Rules title="sc-review-rules-title" />
        </div>
      </div>
      <div className="waves">
        <div className="vote-buttons">
          <VoteButton
            kind="yes"
            className="yes-button"
            onClick={handleVoteYes}
            data-testid="yes-button"
          />
          <Button
            outline
            rounded
            className="skip-button"
            onClick={handleSkip}
            data-testid="skip-button">
            <SkipIcon />
            <Localized id="skip">
              <span />
            </Localized>{' '}
          </Button>
          <VoteButton
            kind="no"
            className="no-button"
            onClick={handleVoteNo}
            data-testid="no-button"
          />
        </div>
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
          <ReportButton onClick={() => setShowReportModal(true)} />
          <Tooltip title={getString('shortcuts')} arrow>
            <Button
              rounded
              outline
              className="hidden-md-down shortcuts-button"
              onClick={handleToggleShortcutsModal}>
              <KeyboardIcon />
            </Button>
          </Tooltip>
        </div>
      </div>
    </SentenceCollectionWrapper>
  )
}

export default withLocalization(Review)
