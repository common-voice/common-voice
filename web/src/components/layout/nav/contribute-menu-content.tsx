import * as React from 'react'
import {
  Localized,
  WithLocalizationProps,
  withLocalization,
} from '@fluent/react'
import classNames from 'classnames'

import { ContributableLocaleLock, LocaleLink } from '../../locale-helpers'
import { ContributeMenuItem } from './contribute-menu'

type ContributeMenuContentProps = {
  className?: string
  pathname?: string
  contributeMenuItems: ContributeMenuItem[]
  renderContributableLock?: boolean
}

const Content = ({
  contributeMenuItems,
}: {
  contributeMenuItems: ContributeMenuItem[]
}) => (
  <div>
    <ul>
      {contributeMenuItems.map(item => (
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
      ))}
    </ul>
  </div>
)

const ContributeMenuContent: React.FC<
  ContributeMenuContentProps & WithLocalizationProps
> = ({ className, contributeMenuItems, renderContributableLock }) => {
  return (
    <div className={className}>
      {renderContributableLock ? (
        <ContributableLocaleLock>
          <Content contributeMenuItems={contributeMenuItems} />
        </ContributableLocaleLock>
      ) : (
        <Content contributeMenuItems={contributeMenuItems} />
      )}
    </div>
  )
}

export default withLocalization(ContributeMenuContent)
