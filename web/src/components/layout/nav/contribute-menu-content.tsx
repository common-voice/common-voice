import * as React from 'react'
import { WithLocalizationProps, withLocalization } from '@fluent/react'

import { ContributeMenuItem } from './contribute-menu'

import { MenuContent } from './contribute-menu/menu-content'

type ContributeMenuContentProps = {
  className?: string
  pathname?: string
  contributeMenuItems: ContributeMenuItem[]
  isUserLoggedIn?: boolean
  isLocaleContributable: boolean
  toggleMenu?: () => void
}

const ContributeMenuContent: React.FC<
  ContributeMenuContentProps & WithLocalizationProps
> = ({
  className,
  contributeMenuItems,
  isUserLoggedIn,
  getString,
  isLocaleContributable,
  toggleMenu,
}) => {
  return (
    <div className={className}>
      <MenuContent
        contributeMenuItems={contributeMenuItems}
        isUserLoggedIn={isUserLoggedIn}
        getString={getString}
        isLocaleContributable={isLocaleContributable}
        toggleMenu={toggleMenu}
      />
    </div>
  )
}

export default withLocalization(ContributeMenuContent)
