import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

export const AnswerQuestions = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="answer-questions" key="answer-questions">
          <TextButton
            onClick={toggleVisibleSection}
            className="guidelines-content-heading"
          />
        </Localized>
        <ChevronDown
          onClick={toggleVisibleSection}
          className={classNames('chevron', { 'rotate-180': contentVisible })}
        />
      </div>

      {(contentVisible || !isMobileWidth) && (
        <div className="content-wrapper">
          <Localized
            id="answer-questions-subheader"
            key="answer-questions-subheader">
            <h2
              className="guidelines-content-subheader"
              id="answer-questions-subheader"
            />
          </Localized>
          <Localized
            id="answer-questions-explanation-1"
            key="answer-questions-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized id="answer-questions-tip-1" key="answer-questions-tip-1">
              <li />
            </Localized>
            <Localized id="answer-questions-tip-2" key="answer-questions-tip-2">
              <li />
            </Localized>
            <Localized
              id="answer-questions-tip-3b"
              key="answer-questions-tip-3b">
              <li />
            </Localized>
            <Localized id="answer-questions-tip-4" key="answer-questions-tip-4">
              <li />
            </Localized>
            <Localized id="answer-questions-tip-5" key="answer-questions-tip-5">
              <li />
            </Localized>
            <Localized id="answer-questions-tip-6" key="answer-questions-tip-6">
              <li />
            </Localized>
          </ul>
          <Localized
            id="answer-questions-explanation-2"
            key="answer-questions-explanation-2">
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  )
}
