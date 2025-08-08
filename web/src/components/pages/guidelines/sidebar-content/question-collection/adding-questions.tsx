import * as React from 'react'
import classNames from 'classnames'
import { Localized } from '@fluent/react'

import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'
import { SidebarContentProps } from '../../types'

export const AddingQuestions = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="adding-questions">
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
          <Localized id="what-makes-a-good-question-subheader">
            <h2
              className="guidelines-content-subheader"
              id="what-makes-a-good-question-subheader"
            />
          </Localized>
          <Localized id="what-makes-a-good-question-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized id="what-makes-a-good-question-explanation-criteria-1">
              <li />
            </Localized>
            <Localized id="what-makes-a-good-question-explanation-criteria-2">
              <li />
            </Localized>
            <Localized id="what-makes-a-good-question-explanation-criteria-3">
              <li />
            </Localized>
          </ul>
          <Localized id="what-makes-a-good-question-tip">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="easy-to-understand">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="easy-to-understand-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="spelling-and-pronunciation">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="spelling-and-pronunciation-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="length">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="length-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized id="dont-add-subheader">
            <h2
              className="guidelines-content-subheader"
              id="dont-add-subheader"
            />
          </Localized>
          <Localized id="offensive-content-sensitive-information">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <ul>
            <Localized id="offensive-content-sensitive-information-explanation-explanation-1">
              <li />
            </Localized>
            <Localized id="offensive-content-sensitive-information-explanation-explanation-2">
              <li />
            </Localized>
            <Localized id="offensive-content-sensitive-information-explanation-explanation-3">
              <li />
            </Localized>
          </ul>
          <Localized id="culturally-specific-questions">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="culturally-specific-questions-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="length">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="length-avoid-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized id="process-steps">
            <p className="guidelines-content-explanation header" />
          </Localized>
          <Localized id="process-steps-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>

          <Localized id="example-questions-subheader">
            <h2 className="guidelines-content-subheader" />
          </Localized>
          <Localized
            id="example-questions-explanation-1"
            elems={{
              examplePromptsLink: (
                <a
                  href="https://docs.google.com/spreadsheets/d/1eQfZe9-PWjrRpiPMZvbWzqmhntEiB9Z1XmuHb-ykIXc/edit?gid=921970007#gid=921970007"
                  target="_blank"
                  rel="noreferrer"
                  className="underlined-link"
                />
              ),
            }}>
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="example-questions-explanation-2"
            elems={{
              githubLink: (
                <a
                  href="https://github.com/common-voice/common-voice"
                  target="_blank"
                  rel="noreferrer"
                  className="underlined-link"
                />
              ),
              emailFragment: (
                <a
                  href="mailto:commonvoice@mozilla.com"
                  target="_blank"
                  rel="noreferrer"
                  className="underlined-link"
                />
              ),
            }}>
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  )
}
