import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'
import { SidebarContentProps } from '../../types'
import { TagsTable } from './components/tags-table'

export const TranscribeAudio = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="transcribe-audio" key="transcribe-audio">
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
            id="transcribe-the-audio-subheader-1"
            key="transcribe-the-audio-subheader-1">
            <h2
              className="guidelines-content-subheader"
              id="transcribe-the-audio-subheader-1"
            />
          </Localized>
          <Localized
            id="transcribe-the-audio-subheader-1-explanation"
            key="transcribe-the-audio-subheader-1-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            <Localized
              id="transcribe-the-audio-subheader-1-explanation-example-1"
              key="transcribe-the-audio-subheader-1-explanation-example-1">
              <li />
            </Localized>
            <Localized
              id="transcribe-the-audio-subheader-1-explanation-example-2"
              key="transcribe-the-audio-subheader-1-explanation-example-2">
              <li />
            </Localized>
            <Localized
              id="transcribe-the-audio-subheader-1-explanation-example-3"
              key="transcribe-the-audio-subheader-1-explanation-example-3">
              <li />
            </Localized>
            <Localized
              id="transcribe-the-audio-subheader-1-explanation-example-4"
              key="transcribe-the-audio-subheader-1-explanation-example-4">
              <li />
            </Localized>
          </ul>

          <Localized
            id="transcribe-the-audio-subheader-2"
            key="transcribe-the-audio-subheader-2">
            <h2
              className="guidelines-content-subheader"
              id="transcribe-the-audio-subheader-2"
            />
          </Localized>
          <ul>
            <Localized
              id="transcribe-the-audio-subheader-2-explanation-1"
              key="transcribe-the-audio-subheader-2-explanation-1">
              <li />
            </Localized>
            <div className="example-container transcribe-the-audio">
              <div className="example-tips-container">
                <Localized
                  id="transcribe-the-audio-subheader-2-example-1-correct"
                  key="transcribe-the-audio-subheader-2-example-1-correct"
                  elems={{ correct: <span className="correct" /> }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-1-wrong"
                  key="transcribe-the-audio-subheader-2-example-1-wrong"
                  elems={{ wrong: <span className="wrong" /> }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-2-correct"
                  key="transcribe-the-audio-subheader-2-example-2-correct"
                  elems={{
                    correct: <span className="correct" />,
                    underline: <span className="underline" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-2-wrong"
                  key="transcribe-the-audio-subheader-2-example-2-wrong"
                  elems={{
                    wrong: <span className="wrong" />,
                    underline: <span className="underline" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-3-correct"
                  key="transcribe-the-audio-subheader-2-example-3-correct"
                  elems={{
                    correct: <span className="correct" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-3-wrong"
                  key="transcribe-the-audio-subheader-2-example-3-wrong"
                  elems={{
                    wrong: <span className="wrong" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
              </div>
            </div>
            <Localized
              id="transcribe-the-audio-subheader-2-explanation-2"
              key="transcribe-the-audio-subheader-2-explanation-2">
              <li />
            </Localized>
            <div className="example-container transcribe-the-audio">
              <div className="example-tips-container">
                <Localized
                  id="transcribe-the-audio-subheader-2-example-4-correct"
                  key="transcribe-the-audio-subheader-2-example-4-correct"
                  elems={{
                    correct: <span className="correct" />,
                    underline: <span className="underline" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
                <Localized
                  id="transcribe-the-audio-subheader-2-example-4-wrong"
                  key="transcribe-the-audio-subheader-2-example-4-wrong"
                  elems={{
                    wrong: <span className="wrong" />,
                    underline: <span className="underline" />,
                  }}>
                  <p className="tip-text" />
                </Localized>
              </div>
            </div>
          </ul>

          <Localized
            id="transcribe-the-audio-subheader-3"
            key="transcribe-the-audio-subheader-3">
            <h2
              className="guidelines-content-subheader"
              id="transcribe-the-audio-subheader-3"
            />
          </Localized>
          <Localized
            id="transcribe-the-audio-subheader-3-explanation"
            key="transcribe-the-audio-subheader-3-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <TagsTable />
          <Localized id="example" key="tag-example">
            <p />
          </Localized>
          <div className="example-container transcribe-the-audio">
            <div className="example-tips-container">
              <Localized
                id="special-tags-example-2"
                key="special-tags-example-2">
                <p className="tip-text" />
              </Localized>
            </div>
          </div>

          <Localized
            id="transcribe-the-audio-subheader-4"
            key="transcribe-the-audio-subheader-4">
            <h2
              className="guidelines-content-subheader"
              id="transcribe-the-audio-subheader-4"
            />
          </Localized>
          <ul>
            <Localized
              id="transcribe-the-audio-subheader-4-explanation-1"
              key="transcribe-the-audio-subheader-4-explanation-1">
              <li />
            </Localized>
            <div className="example-container transcribe-the-audio">
              <div className="example-tips-container">
                <Localized
                  id="transcribe-the-audio-subheader-4-explanation-1-example"
                  key="transcribe-the-audio-subheader-4-explanation-1-example"
                  elems={{ underline: <span className="underline" /> }}>
                  <p className="tip-text" />
                </Localized>
              </div>
            </div>
            <Localized
              id="transcribe-the-audio-subheader-4-explanation-2"
              key="transcribe-the-audio-subheader-4-explanation-2">
              <li />
            </Localized>
            <div className="example-container transcribe-the-audio">
              <div className="example-tips-container">
                <Localized
                  id="transcribe-the-audio-subheader-4-explanation-2-example"
                  key="transcribe-the-audio-subheader-4-explanation-2-example"
                  elems={{ underline: <span className="underline" /> }}>
                  <p className="tip-text" />
                </Localized>
              </div>
            </div>
          </ul>

          <Localized
            id="transcribe-the-audio-subheader-5"
            key="transcribe-the-audio-subheader-5">
            <h2
              className="guidelines-content-subheader"
              id="transcribe-the-audio-subheader-5"
            />
          </Localized>

          <ul>
            <Localized
              id="transcribe-the-audio-subheader-5-explanation-1"
              key="transcribe-the-audio-subheader-5-explanation-1">
              <li />
            </Localized>
            <Localized
              id="transcribe-the-audio-subheader-5-explanation-2"
              key="transcribe-the-audio-subheader-5-explanation-2">
              <li />
            </Localized>
          </ul>
        </div>
      )}
    </div>
  )
}
