import * as React from 'react'

import { ReviewIcon } from '../../../../ui/icons'
import SentenceCollectionWrapper from '../sentence-collector-wrapper'

import './review.css'
import { Instruction } from '../instruction'

const Review = () => (
  <SentenceCollectionWrapper dataTestId="review-page" type="review">
    <div className="sentence-and-guidelines-container">
      <div className="sentence-and-guidelines">
        <Instruction
          firstPartId="sc-review-instruction-first-part"
          secondPartId="sc-review-instruction-second-part"
          icon={<ReviewIcon />}
        />
      </div>
    </div>
  </SentenceCollectionWrapper>
)

export default Review
