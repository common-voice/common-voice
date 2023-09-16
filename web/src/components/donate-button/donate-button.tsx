import React from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../ui/ui'
import { HeartIcon } from '../ui/icons'

import './donate-button.css'

const DonateButton = () => (
  <LinkButton href="?form=FUNUAFTPPYR" className="donate-btn" rounded>
    <HeartIcon />
    <Localized id="donate" />
  </LinkButton>
)

export default DonateButton
