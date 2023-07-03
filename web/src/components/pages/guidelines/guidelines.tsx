import * as React from 'react'
import { Localized } from '@fluent/react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import classNames from 'classnames'

import Page from '../../ui/page'
import PageHeading from '../../ui/page-heading'
import VoiceSidebarContent from './sidebar-content/voice-sidebar-content'
import SentenceSidebarContent from './sidebar-content/sentence-sidebar-content'
import RoundButton from '../../ui/round-button'
import { DiscourseIconCode, MailIcon } from '../../ui/icons'
import VisuallyHidden from '../../visually-hidden/visually-hidden'
import { DiscourseLink, MatrixLink } from '../../shared/links'
import { LinkButton } from '../../ui/ui'

import { SENTENCE_NAV_IDS, VOICE_NAV_IDS } from './constants'
import { COMMON_VOICE_EMAIL } from '../../../constants'

import './guidelines.css'

const Guidelines = () => {
  const { hash } = window.location
  const id = hash.replace('#', '')

  const defaultVoiceOption = VOICE_NAV_IDS.PRONUNCIATIONS
  const defaultSentenceOption = SENTENCE_NAV_IDS.PUBLIC_DOMAIN

  const [selectedTabIndex, setSelectedTabIndex] = React.useState(0)

  const [selectedTabOption, setSelectedTabOption] =
    React.useState(defaultVoiceOption)

  const handleOnTabSelect = (index: number, lastIndex: number) => {
    // If the user changes the tab select the first tab option by default
    if (lastIndex !== index) {
      if (index === 0) {
        setSelectedTabOption(defaultVoiceOption)
      } else {
        setSelectedTabOption(defaultSentenceOption)
      }
    }

    setSelectedTabIndex(index)
  }

  React.useEffect(() => {
    if (hash) {
      const tabIndexToSelect = Object.values(VOICE_NAV_IDS).includes(id) ? 0 : 1
      setSelectedTabIndex(tabIndexToSelect)

      const element = document.getElementById(id)

      if (element) {
        setSelectedTabOption(id)
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }
    } else {
      setSelectedTabIndex(0)
    }
  }, [])

  return (
    <Page className="guidelines-main-container" dataTestId="guidelines-page">
      <section className="header-section">
        <div className="header-container">
          <div>
            <PageHeading>
              <Localized id="guidelines-header" />
            </PageHeading>
            <Localized id="guidelines-header-subtitle">
              <p className="subtitle-text" />
            </Localized>
          </div>
        </div>
      </section>
      <section className="content-section">
        <Tabs selectedIndex={selectedTabIndex} onSelect={handleOnTabSelect}>
          <div className="tablist-wrapper">
            <TabList className="tablist">
              <Localized id="voice-collection">
                <Tab
                  selectedClassName="selected-tab"
                  className="tab first-tab"
                />
              </Localized>
              <Localized id="sentence-collection">
                <Tab selectedClassName="selected-tab" className="tab" />
              </Localized>
            </TabList>
          </div>

          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              <ul>
                {Object.keys(VOICE_NAV_IDS).map(key => (
                  <li key={VOICE_NAV_IDS[key]}>
                    <div className="line" />
                    <a
                      href={`#${VOICE_NAV_IDS[key]}`}
                      onClick={() => setSelectedTabOption(VOICE_NAV_IDS[key])}
                      className={classNames({
                        'selected-option':
                          VOICE_NAV_IDS[key] === selectedTabOption,
                      })}>
                      <Localized id={VOICE_NAV_IDS[key]} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sections">
              <VoiceSidebarContent />
            </div>
          </TabPanel>
          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              <ul>
                {Object.keys(SENTENCE_NAV_IDS).map(key => (
                  <li key={SENTENCE_NAV_IDS[key]}>
                    <div className="line" />
                    <a
                      href={`#${SENTENCE_NAV_IDS[key]}`}
                      onClick={() =>
                        setSelectedTabOption(SENTENCE_NAV_IDS[key])
                      }
                      className={classNames({
                        'selected-option':
                          SENTENCE_NAV_IDS[key] === selectedTabOption,
                      })}>
                      <Localized id={SENTENCE_NAV_IDS[key]} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sections">
              <SentenceSidebarContent />
            </div>
          </TabPanel>
        </Tabs>
      </section>
      <section className="contact-section">
        <div className="contact-container">
          <Localized id="still-have-questions">
            <h1 />
          </Localized>
          <div className="text-container">
            <p>
              <RoundButton>
                <DiscourseLink data-testid="discourse-button">
                  <VisuallyHidden>Discourse</VisuallyHidden>
                  <DiscourseIconCode />
                </DiscourseLink>
              </RoundButton>
              <Localized
                id="about-stay-in-touch-text-2"
                elems={{
                  discourseLink: <DiscourseLink />,
                  matrixLink: <MatrixLink />,
                }}>
                <span />
              </Localized>
            </p>

            <LinkButton rounded blank href={`mailto:${COMMON_VOICE_EMAIL}`}>
              <MailIcon />
              <Localized id="contact-common-voice" />
            </LinkButton>
          </div>
        </div>
      </section>
    </Page>
  )
}

export default Guidelines
