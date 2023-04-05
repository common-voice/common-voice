import * as React from 'react'

import { Localized } from '@fluent/react'
import { ReviewIcon } from '../../../../ui/icons'
import SentenceCollectionWrapper from '../sentence-collector-wrapper'

import './review.css'

const Review = () => (
  <SentenceCollectionWrapper dataTestId="review-page" type="review">
    <div className="sentence-and-guidelines-container">
      <div className="sentence-and-guidelines">
        <div className="review-page-instruction">
          <Localized id="sc-review-header-check">
            <span />
          </Localized>
          <ReviewIcon />
          <Localized id="sc-review-header-linguistically-correct">
            <span />
          </Localized>
        </div>
      </div>
    </div>
  </SentenceCollectionWrapper>
)

export default Review
