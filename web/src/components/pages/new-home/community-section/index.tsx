import React, { useState } from 'react'
import { Localized, useLocalization } from '@fluent/react'
import classNames from 'classnames'

import { Button, TextButton } from '../../../ui/ui'

import CloseIcon from './assets/close.svg'
import DiscordIcon from './assets/discord.svg'
import AwardIcon from './assets/award.svg'
import IdeaLightBulb from './assets/idea-light-bulb.svg'

import PlusIcon from '../../../../components/ui/icons/plus.svg'
import { GithubIcon, ShareLinkIcon } from '../../../ui/icons'

import './community-section.css'

interface Section {
  title: string
  content: string
  image: string
  action: () => JSX.Element
}

const sections: Section[] = [
  {
    title: 'join-discord-community',
    content: 'join-discord-community-content',
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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

export const CommunitySection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const { l10n } = useLocalization()

  const handleToggle = (index: number) => {
    setActiveSection(activeSection === index ? null : index)
  }

  return (
    <section className="community-section">
      <div className="community-section-container">
        <Localized id="community-section-title">
          <h1 className="title" />
        </Localized>
        <div className="pane-container">
          <div className="left-pane">
            {sections.map((section, index) => (
              <div key={index} className="section">
                <TextButton
                  className={classNames('section-header', {
                    active: activeSection === index,
                  })}
                  onClick={() => handleToggle(index)}>
                  {l10n.getString(section.title)}
                  <span className="toggle-icon">
                    {activeSection === index ? (
                      <img src={CloseIcon} alt="close icon" />
                    ) : (
                      <img src={PlusIcon} alt="open icon" className="open" />
                    )}
                  </span>
                </TextButton>
                {activeSection === index && (
                  <div className="section-content">
                    <p>{l10n.getString(section.content)}</p>
                    <section.action />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="right-pane">
            {activeSection !== null && (
              <img
                src={sections[activeSection].image}
                alt="Community Section"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
