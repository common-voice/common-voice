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
  <div>
    <ul>
      {contributeMenuItems.map(item => {
        const shouldShowItem =
          (item.requiresAuth && isUserLoggedIn) || !item.requiresAuth

        if (!shouldShowItem) return null

        return (
          <li key={item.localizedId}>
            <div
              className={classNames('content', {
                'coming-soon': !item.href,
              })}>
              <item.icon />
              {item.href ? (
                <LocaleLink to={item.href} className="contribute-link">
                  <Localized id={item.localizedId} />
                </LocaleLink>
              ) : (
                <Localized id={item.localizedId}>
                  <p />
                </Localized>
              )}
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
