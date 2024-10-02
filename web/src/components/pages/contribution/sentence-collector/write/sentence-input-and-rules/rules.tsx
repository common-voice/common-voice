import * as React from 'react'
import classNames from 'classnames'

import { SentenceSubmissionError } from 'common'

import { SinglewriteRules } from './single-write-rules'
import { SmallBatchRules } from './small-batch-rules'
import { WriteMode } from '../sentence-write'

import './rules.css'

type Props = {
  localizedTitleId: string
  localizedSmallBatchTitleId?: string
  error?: SentenceSubmissionError
  showFirstRule?: boolean
  isLoggedIn?: boolean
  mode?: WriteMode
}

export const Rules: React.FC<Props> = ({
  error,
  showFirstRule,
  isLoggedIn,
  mode,
  localizedTitleId,
  localizedSmallBatchTitleId,
}) => {
  const isSmallBatchMode = mode === 'small-batch'
  const showSmallBatchRules = isLoggedIn && isSmallBatchMode

  const [rulesSection, setRulesSectionVisible] = React.useState({
    singleVisible: true,
    smallBatchVisible: true,
  })

  const handleToggle = (section: 'single' | 'smallBatch') => {
    setRulesSectionVisible({
      ...rulesSection,
      [`${section}Visible`]: !rulesSection[`${section}Visible`],
    })
  }

  const smallBatchAndSingleRulesHidden =
    !rulesSection.singleVisible && !rulesSection.smallBatchVisible

  return (
    <div
      className={classNames('rules', {
        'write-rules': showFirstRule,
        'rules-hidden': smallBatchAndSingleRulesHidden,
      })}>
      <div className="inner">
        <SinglewriteRules
          error={error}
          showFirstRule={showFirstRule}
          isLoggedIn={isLoggedIn}
          title={localizedTitleId}
          mode={mode}
          onToggle={handleToggle}
          isVisible={rulesSection.singleVisible}
        />

        {showSmallBatchRules && (
          <>
            <div className="horizontal-line" />
            <SmallBatchRules
              title={localizedSmallBatchTitleId}
              onToggle={handleToggle}
              isVisible={rulesSection.smallBatchVisible}
            />
          </>
        )}
      </div>
    </div>
  )
}
