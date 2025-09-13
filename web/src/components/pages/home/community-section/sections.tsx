import React from 'react'
import { Localized } from '@fluent/react'

import { LinkButton } from '../../../ui/ui'

import DiscordIcon from './assets/discord.svg'
import AwardIcon from './assets/award.svg'
import IdeaLightBulb from './assets/idea-light-bulb.svg'

import { GithubIcon, ShareLinkIcon } from '../../../ui/icons'
import { ContactLink } from '../../../shared/links'

interface Section {
  title: string
  content: string
  image: string
  actions: (() => JSX.Element)[]
}

export const sections: Section[] = [
  {
    title: 'join-discord-community',
    content: 'join-discord-community-content',
    image: require('./assets/discord.webp'),
    actions: [
      () => (
        <LinkButton
          rounded
          className="action"
          href="https://discord.gg/4TjgEdq25Y"
          blank>
          <img src={DiscordIcon} alt="discord icon" />
          <Localized id="join-discord-community-action">
            <span />
          </Localized>
        </LinkButton>
      ),
    ],
  },
  {
    title: 'find-us-on-matrix',
    content: 'find-us-on-matrix-content-v2',
    image: require('./assets/matrix.webp'),
    actions: [
      () => (
        <LinkButton
          rounded
          className="action"
          href="https://app.element.io/#/room/#common-voice:mozilla.org"
          blank>
          <img src={IdeaLightBulb} alt="idea icon" />
          <Localized id="find-us-on-element-action-1">
            <span />
          </Localized>
        </LinkButton>
      ),
      () => (
        <LinkButton
          rounded
          className="action"
          href="https://matrix.to/#/#common-voice:mozilla.org"
          blank>
          <img src={IdeaLightBulb} alt="idea icon" />
          <Localized id="find-us-on-matrix-action-2">
            <span />
          </Localized>
        </LinkButton>
      ),
    ],
  },
  {
    title: 'ask-mozilla-share',
    content: 'ask-mozilla-share-content',
    image: require('./assets/mozilla-share.webp'),
    actions: [
      () => (
        <ContactLink className="action">
          <ShareLinkIcon />
          <Localized id="ask-mozilla-share-action">
            <span />
          </Localized>
        </ContactLink>
      ),
    ],
  },
  {
    title: 'download-contribution-certificate',
    content: 'download-contribution-certificate-content',
    image: require('./assets/certificate.webp'),
    actions: [
      () => (
        <LinkButton
          rounded
          className="action"
          href={require('./assets/certificate-of-contribution-to-open-source-multilingual-technology.webp')}
          target="_blank"
          download="certificate-of-contribution-to-open-source-multilingual-technology">
          <img src={AwardIcon} alt="award icon" />
          <Localized id="download-contribution-certificate-action">
            <span />
          </Localized>
        </LinkButton>
      ),
    ],
  },
  {
    title: 'contribute-github',
    content: 'contribute-github-content',
    image: require('./assets/contribute.webp'),
    actions: [
      () => (
        <LinkButton
          rounded
          className="action"
          href="https://github.com/common-voice"
          blank>
          <GithubIcon className="github-icon" />
          <Localized id="contribute-github-action">
            <span />
          </Localized>
        </LinkButton>
      ),
    ],
  },
]
