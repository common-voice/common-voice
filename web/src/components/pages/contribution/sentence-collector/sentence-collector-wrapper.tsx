import * as React from 'react'

type Props = {
  dataTestId?: string
  extraClassName?: string
  type: 'write' | 'review'
}

import './sentence-collector-wrapper.css'
import classNames from 'classnames'

const SentenceCollectionWrapper: React.FC<Props> = ({
  children,
  extraClassName,
  dataTestId,
  type,
}) => (
  <div className={`${type}-page`} data-testid={dataTestId}>
    <div className={`${type}-wrapper`}>
      <div className={classNames(type, extraClassName)}>{children}</div>
    </div>
  </div>
)

export default SentenceCollectionWrapper
