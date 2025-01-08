import { withLocalization } from '@fluent/react'
import * as React from 'react'
import { DiscordIcon } from '../ui/icons'

import './share-buttons.css'

function ShareButtons() {
  return (
    <a
      className="share-button"
      href="https://discord.gg/4TjgEdq25Y"
      target="_blank"
      rel="noopener noreferrer">
      <DiscordIcon />
    </a>
  )
}

export default withLocalization(ShareButtons)
