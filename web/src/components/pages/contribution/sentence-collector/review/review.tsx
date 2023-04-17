import * as React from 'react'
import { Localized } from '@fluent/react'

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

import {
  useAccount,
  useAction,
  useLanguages,
} from '../../../../../hooks/store-hooks'
import { Sentences } from '../../../../../stores/sentences'
import { useTypedSelector } from '../../../../../stores/tree'
import { useLocale } from '../../../../locale-helpers'
import URLS from '../../../../../urls'

import { ReportModal } from '../../report/report'
import { ReportModalProps } from '../../report/report'

import './review.css'
import ReviewShortcutsModal from './review-shortcuts-modal'
import reviewShortCuts from './review-shortcuts'

const reportModalProps = {
  reasons: [
    'offensive-language',
    'grammar-or-spelling',
    'different-language',
    'difficult-pronounce',
  ],
  kind: 'sentence' as ReportModalProps['kind'],
  id: 'some-sentence-id',
}

const Review = () => {
  const [showReportModal, setShowReportModal] = React.useState(false)
  const [showShortcutsModal, setShowShortcutsModal] = React.useState(false)

  const [currentLocale] = useLocale()
  const languages = useLanguages()
  const account = useAccount()

  const localeId = languages.localeNameAndIDMapping.find(
    locale => locale.name === currentLocale
  ).id

  const fetchPendingSentences = useAction(
    Sentences.actions.refillPendingSentences
  )

  const handleFetch = () => {
    try {
      fetchPendingSentences(localeId)
    } catch (error) {
      console.error({ error })
    }
  }

  const handleKeyPress = (evt: KeyboardEvent) => {
    if (
      evt.ctrlKey ||
      evt.altKey ||
      evt.shiftKey ||
      evt.metaKey ||
      showReportModal
    ) {
      return
    }
  }

  const handleToggleShortcutsModal = () => {
    setShowShortcutsModal(!showShortcutsModal)
  }

  const sentences = useTypedSelector(({ sentences }) => sentences)

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  const isLoading = sentences[currentLocale]?.isLoadingPendingSentences

  const noPendingSentences =
    !isLoading && pendingSentencesSubmissions.length === 0

  React.useEffect(() => {
    handleFetch()
  }, [])

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

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
          onSubmitted={() => console.log('skip')}
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
                  key={index}
                  isActive={index === 0}
                  index={index}
                />
              ))}
            </div>
          )}
          <Rules title="sc-review-rules-title" />
        </div>
      </div>
      <div className="waves">
        <div className="primary-buttons">
          <VoteButton kind="yes" disabled className="yes-button" />
          <Button outline rounded className="skip-button">
            <SkipIcon />
            <Localized id="skip">
              <span />
            </Localized>{' '}
          </Button>
          <VoteButton kind="no" disabled className="no-button" />
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
          <Button
            rounded
            outline
            className="hidden-sm-down shortcuts-button"
            onClick={handleToggleShortcutsModal}>
            <KeyboardIcon />
          </Button>
        </div>
      </div>
    </SentenceCollectionWrapper>
  )
}

export default Review
