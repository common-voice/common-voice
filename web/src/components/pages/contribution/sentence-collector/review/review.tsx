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

import {
  useAccount,
  useAction,
  useLanguages,
} from '../../../../../hooks/store-hooks'
import { Sentences } from '../../../../../stores/sentences'
import { useTypedSelector } from '../../../../../stores/tree'
import { useLocale } from '../../../../locale-helpers'
import URLS from '../../../../../urls'

import './review.css'
import ReviewEmptyState from './review-empty-state'

const Review = () => {
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

  const sentences = useTypedSelector(({ sentences }) => sentences)

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  const isLoading = sentences[currentLocale]?.isLoadingPendingSentences

  const noPendingSentences =
    !isLoading && pendingSentencesSubmissions.length === 0

  // TODO: prevent flash when user is not logged in
  React.useEffect(() => {
    if (!account) {
      try {
        sessionStorage.setItem('redirectURL', location.pathname)
      } catch (e) {
        console.warn(`A sessionStorage error occurred ${e.message}`)
      }

      window.location.href = '/login'
    }
  }, [])

  React.useEffect(() => {
    handleFetch()
  }, [])

  if (noPendingSentences) {
    return (
      <SentenceCollectionWrapper dataTestId="review-page" type="review">
        <ReviewEmptyState />
      </SentenceCollectionWrapper>
    )
  }

  return (
    <SentenceCollectionWrapper dataTestId="review-page" type="review">
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
          <ReportButton />
          <Button rounded outline className="hidden-sm-down shortcuts-button">
            <KeyboardIcon />
          </Button>
        </div>
      </div>
    </SentenceCollectionWrapper>
  )
}

export default Review
