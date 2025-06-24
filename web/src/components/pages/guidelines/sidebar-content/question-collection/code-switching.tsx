import React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

export const CodeSwitching = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="code-switching">
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
          <Localized id="adding-questions">
            <h2
              className="guidelines-content-subheader"
              id="adding-questions"
            />
          </Localized>
          <Localized id="code-switching-do-subheader-title">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-adding-questions-do-guidelines-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-questions-do-guidelines-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-questions-do-guidelines-3"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>
          <Localized id="code-switching-do-not-subheader-title">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-adding-questions-do-not-guidelines-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-questions-do-not-guidelines-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-adding-questions-do-not-guidelines-3"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized id="code-switching-validating-questions">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-validating-questions"
            />
          </Localized>
          <ul>
            <Localized
              id="code-switching-validating-questions-explanation-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-validating-questions-explanation-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized id="code-switching-answering-questions">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-answering-questions"
            />
          </Localized>
          <ul>
            <Localized
              id="code-switching-answering-questions-explanation-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-answering-questions-explanation-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized id="code-switching-transcribing-audio-questions">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-transcribing-audio-questions"
            />
          </Localized>
          <ul>
            <Localized
              id="code-switching-transcribing-audio-questions-explanation-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-transcribing-audio-questions-explanation-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized id="code-switching-review-transcriptions">
            <h2
              className="guidelines-content-subheader"
              id="code-switching-review-transcription"
            />
          </Localized>
          <ul>
            <Localized
              id="code-switching-review-transcriptions-explanation-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-review-transcriptions-explanation-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>

          <Localized id="code-switching">
            <h2 className="guidelines-content-subheader" id="code-switching" />
          </Localized>
          <ul>
            <Localized
              id="code-switching-explanation-1"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
            <Localized
              id="code-switching-explanation-2"
              elems={{ bold: <strong /> }}>
              <li />
            </Localized>
          </ul>
          <Localized id="code-switching-explanation-3">
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  )
}
