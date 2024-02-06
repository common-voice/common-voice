import React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { SidebarContentProps } from '../../types'
import { TextButton } from '../../../../ui/ui'
import { ChevronDown } from '../../../../ui/icons'

const sentenceDomains = [
  'sentence-domain-general',
  'sentence-domain-agriculture',
  'sentence-domain-automotive',
  'sentence-domain-finance',
  'sentence-domain-food-service-retail',
  'sentence-domain-healthcare',
  'sentence-domain-history-law-government',
  'sentence-domain-media-entertainment',
  'sentence-domain-nature-environment',
  'sentence-domain-news-current-affairs',
  'sentence-domain-technology-robotics',
  'sentence-domain-language-fundamentals',
]

export const Domain: React.FC<SidebarContentProps> = ({
  id,
  contentVisible,
  toggleVisibleSection,
  isMobileWidth,
}) => {
  return (
    <div className="sidebar-content" id={id}>
      <span className="line" />
      <div className="sidebar-content-header">
        <Localized id="domain">
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
            {sentenceDomains.map(domain => (
              <Localized id={domain} key={domain}>
                <li />
              </Localized>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
