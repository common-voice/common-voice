import * as React from 'react'
import classNames from 'classnames'

import { SentenceSubmissionError } from 'common'

import { SinglewriteRules } from './single-write-rules'
import { SmallBatchRules } from './small-batch-rules'
import { WriteMode } from '../sentence-write'

import URLS from '../../../../../../urls'

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
  const showLoginInstruction =
    !isLoggedIn && !location.pathname.includes(URLS.REVIEW)

  const [rulesSection, setRulesSectionVisible] = React.useState({
    singleVisible: !isSmallBatchMode,
    smallBatchVisible: true,
  })

  React.useEffect(() => {
    setRulesSectionVisible({
      ...rulesSection,
      smallBatchVisible: true,
      singleVisible: !isSmallBatchMode,
    })
  }, [isSmallBatchMode])

  const handleToggle = (section: 'single' | 'smallBatch') => {
    setRulesSectionVisible(prevRulesSection => {
      const updatedRulesSection = {
        ...prevRulesSection,
        [`${section}Visible`]: !prevRulesSection[`${section}Visible`],
      }

      if (updatedRulesSection[`${section}Visible`] === true) {
        const otherKey =
          `${section}Visible` === 'singleVisible'
            ? 'smallBatchVisible'
            : 'singleVisible'

        updatedRulesSection[otherKey] = false
      }

      return updatedRulesSection
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
          showLoginInstruction={showLoginInstruction}
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
