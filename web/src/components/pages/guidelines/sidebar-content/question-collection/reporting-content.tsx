import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

export const ReportingContent = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}: SidebarContentProps) => {
  return (
    <div className="sidebar-content no-border" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="reporting-content" key="reporting-content">
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
            id="reporting-content-subheader"
            key="reporting-content-subheader">
            <h2
              className="guidelines-content-subheader"
              id="reporting-content-subheader"
            />
          </Localized>
          <Localized
            id="reporting-content-explanation-1"
            key="reporting-content-explanation-1">
            <p className="guidelines-content-explanation" />
          </Localized>
          <Localized
            id="reporting-content-explanation-2"
            key="reporting-content-explanation-2">
            <p className="guidelines-content-explanation" />
          </Localized>
        </div>
      )}
    </div>
  )
}
