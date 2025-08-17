import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

export const ReviewTheTranscription = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="review-the-transcription" key="review-the-transcription">
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
            id="review-the-transcription-subheader"
            key="review-the-transcription-subheader">
            <h2
              className="guidelines-content-subheader"
              id="review-the-transcription-subheader"
            />
          </Localized>
          <Localized
            id="review-the-transcription-explanation-1"
            key="review-the-transcription-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="review-the-transcription-explanation-2"
            key="review-the-transcription-explanation-2">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="review-the-transcription-explanation-3"
            key="review-the-transcription-explanation-3">
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  )
}
