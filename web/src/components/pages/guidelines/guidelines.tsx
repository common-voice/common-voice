import * as React from 'react'
import { Localized } from '@fluent/react'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import { Link } from 'react-router-dom'

import Page from '../../ui/page'
import PageHeading from '../../ui/page-heading'
import VoiceSidebarContent from './sidebar-content/voice-sidebar-content'
import SentenceSidebarContent from './sidebar-content/sentence-sidebar-content'
import { SpontaneousSpeechContent } from './sidebar-content/spontaneous-speech-content'
import RoundButton from '../../ui/round-button'
import { DiscourseIconCode, MailIcon } from '../../ui/icons'
import VisuallyHidden from '../../visually-hidden/visually-hidden'
import { DiscourseLink, MatrixLink } from '../../shared/links'
import { LinkButton } from '../../ui/ui'
import { SidebarNavSection } from './components/sidebar-nav-section'

import {
  CODE_SWITCHING_ITEMS,
  QUESTION_COLLECTION_ITEMS,
  SENTENCE_COLLECTION_ITEMS,
  TRANSCRIBE_AUDIO_ITEMS,
  VOICE_COLLECTION_ITEMS,
} from './constants'
import { COMMON_VOICE_EMAIL } from '../../../constants'
import useScrollToGuidelinesSection from './use-scroll-to-guidelines-section'
import { useToLocaleRoute } from '../../locale-helpers'
import URLS from '../../../urls'

import './guidelines.css'

const Guidelines = () => {
  const defaultVoiceOption = 'voice-collection'

  const toLocaleRoute = useToLocaleRoute()

  const guidelinesRoute = toLocaleRoute(URLS.GUIDELINES)

  const isFeatureCodeSwitching = location.href.includes('feature=code-switch')

  const {
    selectedTabIndex,
    setSelectedTabIndex,
    selectedTabOption,
    setSelectedTabOption,
    selectedSection,
    setSelectedSection,
  } = useScrollToGuidelinesSection()

  const handleOnTabSelect = (index: number, lastIndex: number) => {
    // If the user changes the tab select the first tab option by default
    if (lastIndex !== index) {
      if (index === 0) {
        setSelectedTabOption(defaultVoiceOption)
      } else {
        setSelectedTabOption('question-collection')
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
              <Tab selectedClassName="selected-tab" className="tab">
                <Link
                  to={`${guidelinesRoute}?tab=scripted-speech`}
                  className="tab-link">
                  <Localized id="scripted-speech" />
                </Link>
              </Tab>
              <Tab selectedClassName="selected-tab" className="tab">
                <Link
                  to={`${guidelinesRoute}?tab=spontaneous-speech`}
                  className="tab-link spontaneous-speech">
                  <Localized id="spontaneous-speech" />
                </Link>
              </Tab>
            </TabList>
          </div>

          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              <SidebarNavSection
                sectionId="voice-collection"
                items={VOICE_COLLECTION_ITEMS}
                selectedTabOption={selectedTabOption}
                setSelectedTabOption={setSelectedTabOption}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                tabSearchParam="?tab=scripted-speech"
              />
              <SidebarNavSection
                sectionId="sentence-collection"
                items={SENTENCE_COLLECTION_ITEMS}
                selectedTabOption={selectedTabOption}
                setSelectedTabOption={setSelectedTabOption}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
                tabSearchParam="?tab=scripted-speech"
              />
            </nav>
            <div className="sections">
              <VoiceSidebarContent />
              <SentenceSidebarContent />
            </div>
          </TabPanel>
          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              {[
                {
                  sectionId: 'question-collection',
                  items: QUESTION_COLLECTION_ITEMS,
                },
                { sectionId: 'answer-questions' },
                {
                  sectionId: 'transcribe-audio',
                  items: TRANSCRIBE_AUDIO_ITEMS,
                },
                { sectionId: 'review-the-transcription' },
                isFeatureCodeSwitching && {
                  sectionId: 'code-switching',
                  items: CODE_SWITCHING_ITEMS,
                },
                { sectionId: 'reporting-content' },
              ].map(({ sectionId, items }) => (
                <SidebarNavSection
                  key={sectionId}
                  sectionId={sectionId}
                  items={items}
                  selectedTabOption={selectedTabOption}
                  setSelectedTabOption={setSelectedTabOption}
                  selectedSection={selectedSection}
                  setSelectedSection={setSelectedSection}
                  tabSearchParam="?tab=spontaneous-speech"
                />
              ))}
            </nav>
            <div className="sections">
              <SpontaneousSpeechContent />
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
                  discordLink: (
                    <a
                      href="https://discord.gg/4TjgEdq25Y"
                      target="_blank"
                      rel="noreferrer"
                    />
                  ),
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
