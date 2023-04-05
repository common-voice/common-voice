import React from 'react'

type Props = {
  dataTestId?: string
  type: 'write' | 'review'
}

import './sentence-collector-wrapper.css'

const SentenceCollectionWrapper: React.FC<Props> = ({
  children,
  dataTestId,
  type,
}) => (
  <div className={`${type}-page`} data-testid={dataTestId}>
    <div className={`${type}-wrapper`}>
      <div className={type}>{children}</div>
    </div>
  </div>
)

export default SentenceCollectionWrapper
