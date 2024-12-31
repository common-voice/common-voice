import * as React from 'react'
import { Localized } from '@fluent/react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { Link } from 'react-router-dom'
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
import useScrollToGuidelinesSection from './use-scroll-to-guidelines-section'
import { useToLocaleRoute } from '../../locale-helpers'
import URLS from '../../../urls'

import './guidelines.css'

const Guidelines = () => {
  const defaultVoiceOption = VOICE_NAV_IDS.PRONUNCIATIONS
  const defaultSentenceOption = SENTENCE_NAV_IDS.PUBLIC_DOMAIN

  const toLocaleRoute = useToLocaleRoute()

  const guidelinesRoute = toLocaleRoute(URLS.GUIDELINES)

  const {
    selectedTabIndex,
    setSelectedTabIndex,
    selectedTabOption,
    setSelectedTabOption,
  } = useScrollToGuidelinesSection()

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
              <Tab selectedClassName="selected-tab" className="tab first-tab">
                <Link to={`${guidelinesRoute}?tab=voice`} className="tab-link">
                  <Localized id="voice-collection" />
                </Link>
              </Tab>
              <Tab selectedClassName="selected-tab" className="tab">
                <Link
                  to={`${guidelinesRoute}?tab=sentence`}
                  className="tab-link">
                  <Localized id="sentence-collection" />
                </Link>
              </Tab>
            </TabList>
          </div>

          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              <ul>
                {(
                  Object.keys(VOICE_NAV_IDS) as Array<
                    keyof typeof VOICE_NAV_IDS
                  >
                ).map(key => (
                  <li key={VOICE_NAV_IDS[key]}>
                    <div className="line" />
                    <Link
                      to={{
                        pathname: location.pathname,
                        hash: `#${VOICE_NAV_IDS[key]}`,
                        search: `?tab=voice`,
                      }}
                      className={classNames({
                        'selected-option':
                          VOICE_NAV_IDS[key] === selectedTabOption,
                      })}
                      onClick={() => setSelectedTabOption(VOICE_NAV_IDS[key])}>
                      <Localized id={VOICE_NAV_IDS[key]} />
                    </Link>
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
                {(
                  Object.keys(SENTENCE_NAV_IDS) as Array<
                    keyof typeof SENTENCE_NAV_IDS
                  >
                ).map(key => (
                  <li key={SENTENCE_NAV_IDS[key]}>
                    <div className="line" />
                    <Link
                      to={{
                        pathname: location.pathname,
                        hash: `#${SENTENCE_NAV_IDS[key]}`,
                        search: `?tab=sentence`,
                      }}
                      className={classNames({
                        'selected-option':
                          SENTENCE_NAV_IDS[key] === selectedTabOption,
                      })}
                      onClick={() =>
                        setSelectedTabOption(SENTENCE_NAV_IDS[key])
                      }>
                      <Localized id={SENTENCE_NAV_IDS[key]} />
                    </Link>
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
