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
import URLS from '../../../urls'

type ContributeMenuContentProps = {
  className?: string
  pathname?: string
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn?: boolean
  isLocaleContributable: boolean
}

const Content = ({
  contributeMenuItems,
  isUserLoggedIn,
  isLocaleContributable,
  getString,
}: {
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn: boolean
  isLocaleContributable: boolean
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
          const isSpeakOrListenUrl =
            internalHref === URLS.SPEAK || internalHref === URLS.LISTEN

          const renderContent = () => {
            if (!isLocaleContributable && isSpeakOrListenUrl) {
              return (
                <>
                  <Icon />
                  <Localized id={localizedId}>
                    <p className="coming-soon-text" />
                  </Localized>
                  <span>({l10n.getString('coming-soon')})</span>
                </>
              )
            }

            if (internalHref && isLocaleContributable) {
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
                    'coming-soon':
                      isComingSoon ||
                      (!isLocaleContributable && isSpeakOrListenUrl),
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
> = ({
  className,
  contributeMenuItems,
  isUserLoggedIn,
  getString,
  isLocaleContributable,
}) => {
  return (
    <div className={className}>
      <Content
        contributeMenuItems={contributeMenuItems}
        isUserLoggedIn={isUserLoggedIn}
        getString={getString}
        isLocaleContributable={isLocaleContributable}
      />
    </div>
  )
}

export default withLocalization(ContributeMenuContent)
