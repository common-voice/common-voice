import { Localized } from '@fluent/react'
import classNames from 'classnames'
import React from 'react'

type Props = {
  sentence: string
  source: string
  index: number
  isActive: boolean
}

const ReviewCard: React.FC<Props> = ({ sentence, source, isActive, index }) => (
  <div
    className={classNames('card card-dimensions', { inactive: !isActive })}
    style={{
      transform: [
        `scale(${isActive ? 1 : 0.9})`,
        `translateX(${(document.dir == 'rtl' ? -1 : 1) * (index - 0) * -130}%)`,
      ].join(' '),
      opacity: index < 0 ? 0 : 1,
    }}>
    <p className="sentence">{sentence}</p>
    <Localized id="sc-my-source" vars={{ source }}>
      <p className="source" />
    </Localized>
  </div>
)

export default ReviewCard
