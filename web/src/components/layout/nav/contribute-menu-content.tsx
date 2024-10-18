import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'
import classNames from 'classnames'

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
}: {
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn: boolean
}) => (
  <div className="content-container">
    <ul>
      {contributeMenuItems.map(item => {
        const shouldShowItem =
          (item.requiresAuth && isUserLoggedIn) || !item.requiresAuth

        if (!shouldShowItem) return null

        const { internalHref, externalHref, localizedId, icon: Icon } = item
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
          <li key={localizedId}>
            <div
              className={classNames('content', {
                'coming-soon': isComingSoon,
              })}>
              <Icon />
              {renderContent()}
            </div>
          </li>
        )
      })}
    </ul>
  </div>
)

const ContributeMenuContent: React.FC<
  ContributeMenuContentProps & WithLocalizationProps
> = ({ className, contributeMenuItems, isUserLoggedIn }) => {
  return (
    <div className={className}>
      <Content
        contributeMenuItems={contributeMenuItems}
        isUserLoggedIn={isUserLoggedIn}
      />
    </div>
  )
}

export default withLocalization(ContributeMenuContent)
