import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'
import { Tooltip } from 'react-tippy'

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

import { useAccount, useSentences } from '../../../../../hooks/store-hooks'
import useReview from './use-review'
import { useLocale } from '../../../../locale-helpers'
import { trackSingleReview } from '../../../../../services/tracker'

import URLS from '../../../../../urls'

import { ReportModalProps } from '../../report/report'

import './review.css'

type Props = WithLocalizationProps

const Review: React.FC<Props> = ({ getString }) => {
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = React.useState(false)

  const [currentLocale] = useLocale()
  const account = useAccount()
  const sentences = useSentences()

  const {
    handleFetch,
    handleVoteYes,
    handleVoteNo,
    handleSkip,
    handleKeyDown,
    reviewShortCuts,
  } = useReview({
    getString,
    showReportModal,
  })

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  const activeSentenceIndex = pendingSentencesSubmissions.findIndex(
    el => el.isValid === null
  )

  const handleToggleShortcutsModal = () => {
    setShowShortcutsModal(!showShortcutsModal)
  }

  const handleReportButtonClick = () => {
    setShowReportModal(true)
    trackSingleReview('report-button-click', currentLocale)
  }

  const isLoading = sentences[currentLocale]?.isLoadingPendingSentences

  const noPendingSentences =
    (!isLoading && pendingSentencesSubmissions.length === 0) ||
    activeSentenceIndex < 0

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
          localizedId="sc-review-instruction"
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
                  variantTag={submission.variantTag}
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
              <span className="skip-text" />
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
          <ReportButton onClick={handleReportButtonClick} />
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
