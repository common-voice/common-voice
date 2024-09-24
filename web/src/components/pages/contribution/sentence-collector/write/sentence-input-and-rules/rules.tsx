import * as React from 'react'
import classNames from 'classnames'

import { SentenceSubmissionError } from 'common'

import { SinglewriteRules } from './single-write-rules'
import { SmallBatchRules } from './small-batch-rules'
import { WriteMode } from '../sentence-write'

import './rules.css'

type Props = {
  error?: SentenceSubmissionError
  showFirstRule?: boolean
  isLoggedIn: boolean
  mode: WriteMode
}

export const Rules: React.FC<Props> = ({
  error,
  showFirstRule,
  isLoggedIn,
  mode,
}) => {
  const isSmallBatchMode = mode === 'small-batch'
  const showSmallBatchRules = isLoggedIn && isSmallBatchMode

  return (
    <div className={classNames('rules', { 'write-rules': showFirstRule })}>
      <div className="inner">
        <SinglewriteRules
          error={error}
          showFirstRule={showFirstRule}
          isLoggedIn={isLoggedIn}
        />

        {showSmallBatchRules && (
          <>
            <div className="horizontal-line" />
            <SmallBatchRules />
          </>
        )}
      </div>
    </div>
  )
}
