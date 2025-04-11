import { Localized } from '@fluent/react'
import classNames from 'classnames'
import * as React from 'react'

import { Tag } from '../../tag'

type Props = {
  sentence: string
  source: string
  index: number
  isActive: boolean
  activeSentenceIndex: number
  variantTag: string
  variantName: string
}

const ReviewCard: React.FC<Props> = ({
  sentence,
  source,
  isActive,
  index,
  activeSentenceIndex,
  variantTag,
  variantName,
}) => {

  return (
    <div
      className={classNames('card card-dimensions', { inactive: !isActive })}
      style={{
        transform: [
          `scale(${isActive ? 1 : 0.9})`,
          `translateX(${
            (document.dir == 'rtl' ? -1 : 1) *
            (index - activeSentenceIndex) *
            -130
          }%)`,
        ].join(' '),
        opacity: index < activeSentenceIndex ? 0 : 1,
      }}
      data-testid={`${isActive ? 'active-review-card' : 'review-card'}`}>
      <p className="sentence">{sentence}</p>
      {variantTag && variantName && <Tag text={`${variantName} [${variantTag}]`} />}
      <Localized id="sc-review-form-source" vars={{ sentenceSource: source }}>
        <p className="source" />
      </Localized>
    </div>
  )
}

export default ReviewCard
