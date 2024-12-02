import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
  useLocalization,
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
} & WithLocalizationProps) => {
  const { l10n } = useLocalization()

  return (
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
                  <Icon />
                  <Localized id={localizedId} />
                </LocaleLink>
              )
            }

            if (externalHref) {
              return (
                <a
                  href={externalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="contribute-link">
                  <Icon />
                  {l10n.getString(localizedId)}
                </a>
              )
            }

            return (
              <>
                <Icon />
                <Localized id={localizedId} elems={{ small: <span /> }}>
                  <p className="coming-soon-text" />
                </Localized>
              </>
            )
          }

          return (
            <React.Fragment key={localizedId}>
              <li
                aria-label={getString(menuItemAriaLabel)}
                id={menuItemTooltip}>
                <div
                  className={classNames('content', {
                    'coming-soon': isComingSoon,
                  })}>
                  {renderContent()}
                </div>
              </li>
              <div>
                <Tooltip
                  anchorSelect={`#${menuItemTooltip}`}
                  place="bottom"
                  style={{
                    width: 'auto',
                    maxWidth: '350px',
                    position: 'absolute',
                  }}>
                  {getString(menuItemTooltip)}
                </Tooltip>
              </div>
            </React.Fragment>
          )
        })}
      </ul>
    </div>
  )
}

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
