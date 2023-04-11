import * as React from 'react'

import { ReviewIcon } from '../../../../ui/icons'
import SentenceCollectionWrapper from '../sentence-collector-wrapper'
import { Instruction } from '../instruction'

import { useAction, useLanguages } from '../../../../../hooks/store-hooks'
import { Sentences } from '../../../../../stores/sentences'

import { useLocale } from '../../../../locale-helpers'
import { Rules } from '../write/sentence-input-and-rules/rules'

import './review.css'
import ReviewCard from './review-card'
import { useTypedSelector } from '../../../../../stores/tree'

const Review = () => {
  const [currentLocale] = useLocale()
  const languages = useLanguages()

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
      console.log({ error })
    }
  }

  const sentences = useTypedSelector(({ sentences }) => sentences)

  const pendingSentencesSubmissions =
    sentences[currentLocale]?.pendingSentences || []

  React.useEffect(() => {
    handleFetch()
  }, [])

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
          <Rules />
        </div>
      </div>
    </SentenceCollectionWrapper>
  )
}

export default Review
