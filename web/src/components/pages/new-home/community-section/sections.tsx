import React from 'react'
import { Localized } from '@fluent/react'

import { Button } from '../../../ui/ui'

import DiscordIcon from './assets/discord.svg'
import AwardIcon from './assets/award.svg'
import IdeaLightBulb from './assets/idea-light-bulb.svg'

import { GithubIcon, ShareLinkIcon } from '../../../ui/icons'

interface Section {
  title: string
  content: string
  image: string
  action: () => JSX.Element
}

export const sections: Section[] = [
  {
    title: 'join-discord-community',
    content: 'join-discord-community-content',
    image: require('./assets/discord.jpg'),
    action: () => (
      <Button rounded className="action">
        <img src={DiscordIcon} alt="discord icon" />
        <Localized id="join-discord-community-action">
          <span />
        </Localized>
      </Button>
    ),
  },
  {
    title: 'find-us-on-matrix',
    content: 'find-us-on-matrix-content',
    image: require('./assets/matrix.jpg'),
    action: () => (
      <Button rounded className="action">
        <img src={IdeaLightBulb} alt="idea icon" />
        <Localized id="find-us-on-matrix-action">
          <span />
        </Localized>
      </Button>
    ),
  },
  {
    title: 'ask-mozilla-share',
    content: 'ask-mozilla-share-content',
    image: require('./assets/mozilla-share.jpg'),
    action: () => (
      <Button rounded className="action">
        <ShareLinkIcon />
        <Localized id="ask-mozilla-share-action">
          <span />
        </Localized>
      </Button>
    ),
  },
  {
    title: 'download-contribution-certificate',
    content: 'download-contribution-certificate-content',
    image: require('./assets/certificate.jpg'),
    action: () => (
      <Button rounded className="action">
        <img src={AwardIcon} alt="award icon" />
        <Localized id="download-contribution-certificate-action">
          <span />
        </Localized>
      </Button>
    ),
  },
  {
    title: 'contribute-github',
    content: 'contribute-github-content',
    image: require('./assets/contribute.jpg'),
    action: () => (
      <Button rounded className="action">
        <GithubIcon className="github-icon" />
        <Localized id="contribute-github-action">
          <span />
        </Localized>
      </Button>
    ),
  },
]
