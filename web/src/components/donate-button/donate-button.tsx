import * as React from 'react'
import { Localized } from '@fluent/react'
import classNames from 'classnames'

import { LinkButton } from '../ui/ui'
import { HeartIcon } from '../ui/icons'

import './donate-button.css'

type DonateButtonProps = {
  shouldApplyRightMargin?: boolean
  onClick?: () => void
  showHeartIcon?: boolean
}

const DonateButton = ({
  shouldApplyRightMargin,
  onClick,
  showHeartIcon = true,
}: DonateButtonProps) => (
  <LinkButton
    href="?form=FUNUAFTPPYR"
    className={classNames('donate-btn', {
      'apply-right-margin': shouldApplyRightMargin,
    })}
    rounded
    onClick={onClick}>
    {showHeartIcon && <HeartIcon />}
    <Localized id="donate" />
  </LinkButton>
)

export default DonateButton
