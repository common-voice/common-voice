import React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

const sentenceDomains = [
  'agriculture',
  'automotive',
  'finance',
  'food_service_retail',
  'general',
  'healthcare',
  'history_law_government',
  'language_fundamentals',
  'media_entertainment',
  'nature_environment',
  'news_current_affairs',
  'technology_robotics',
]

export const SentenceDomain: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="sentence-domain">
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
          <Localized id="domain-explanation">
            <p className="guidelines-content-explanation" />
          </Localized>
          <ul>
            {sentenceDomains.map(sentenceDomain => (
              <Localized id={sentenceDomain} key={sentenceDomain}>
                <li />
              </Localized>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
