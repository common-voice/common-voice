import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'
import classNames from 'classnames'
import { Tooltip } from 'react-tooltip'

import { LocaleLink } from '../../locale-helpers'
import { ContributeMenuItem } from './contribute-menu'

type ContributeMenuContentProps = {
  className?: string
  pathname?: string
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn?: boolean
}

const Content = ({
  contributeMenuItems,
  isUserLoggedIn,
  getString,
}: {
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn: boolean
} & WithLocalizationProps) => (
  <div className="content-container">
    <ul>
      {contributeMenuItems.map(item => {
        const shouldShowItem =
          (item.requiresAuth && isUserLoggedIn) || !item.requiresAuth

        if (!shouldShowItem) return null

        const {
          internalHref,
          externalHref,
          localizedId,
          icon: Icon,
          menuItemTooltip,
          menuItemAriaLabel,
        } = item
        const isComingSoon = !(internalHref || externalHref)

        const renderContent = () => {
          if (internalHref) {
            return (
              <LocaleLink to={internalHref} className="contribute-link">
                <Localized id={localizedId} />
              </LocaleLink>
            )
          }

          if (externalHref) {
            return (
              <Localized id={localizedId}>
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="contribute-link"
                />
              </Localized>
            )
          }

          return (
            <Localized id={localizedId} elems={{ small: <span /> }}>
              <p className="coming-soon-text" />
            </Localized>
          )
        }

        return (
          <>
            <li
              key={localizedId}
              aria-label={getString(menuItemAriaLabel)}
              id={menuItemTooltip}>
              <div
                className={classNames('content', {
                  'coming-soon': isComingSoon,
                })}>
                <Icon />
                {renderContent()}
              </div>
            </li>
            <Tooltip
              anchorSelect={`#${menuItemTooltip}`}
              place="bottom"
              style={{ width: 'auto', maxWidth: '550px' }}>
              {getString(menuItemTooltip)}
            </Tooltip>
          </>
        )
      })}
    </ul>
  </div>
)

const ContributeMenuContent: React.FC<
  ContributeMenuContentProps & WithLocalizationProps
> = ({ className, contributeMenuItems, isUserLoggedIn, getString }) => {
  return (
    <div className={className}>
      <Content
        contributeMenuItems={contributeMenuItems}
        isUserLoggedIn={isUserLoggedIn}
        getString={getString}
      />
    </div>
  )
}

export default withLocalization(ContributeMenuContent)
