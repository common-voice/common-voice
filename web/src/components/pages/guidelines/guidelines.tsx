import * as React from 'react';
import { Link } from 'react-router-dom';
import { Localized } from '@fluent/react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import classNames from 'classnames';

import Page from '../../ui/page';
import PageHeading from '../../ui/page-heading';
import { SENTENCE_NAV_IDS, VOICE_NAV_IDS } from './constants';
import VoiceSidebarContent from './sidebar-content/voice-sidebar-content';
import SentenceSidebarContent from './sidebar-content/sentence-sidebar-content';
import RoundButton from '../../ui/round-button';
import { DiscourseIconCode, MailIcon } from '../../ui/icons';
import VisuallyHidden from '../../visually-hidden/visually-hidden';
import { DiscourseLink, MatrixLink } from '../../shared/links';
import { LinkButton } from '../../ui/ui';
import { COMMON_VOICE_EMAIL } from '../../../constants';

import './guidelines.css';

const Guidelines = () => {
  const defaultVoiceOption = VOICE_NAV_IDS.PRONUNCIATIONS;
  const defaultSentenceOption = SENTENCE_NAV_IDS.PUBLIC_DOMAIN;

  const [selectedVoiceTabOption, setSelectedVoiceTabOption] =
    React.useState(defaultVoiceOption);

  const [selectedSentenceTabOption, setSelectedSentenceTabOption] =
    React.useState(defaultSentenceOption);

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
        <Tabs>
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
                      onClick={() =>
                        setSelectedVoiceTabOption(VOICE_NAV_IDS[key])
                      }
                      className={classNames({
                        'selected-option':
                          VOICE_NAV_IDS[key] === selectedVoiceTabOption,
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
                        setSelectedSentenceTabOption(SENTENCE_NAV_IDS[key])
                      }
                      className={classNames({
                        'selected-option':
                          SENTENCE_NAV_IDS[key] === selectedSentenceTabOption,
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
        <img src={require('./images/guidelines-waves-2.png')} alt="" />
      </section>
    </Page>
  );
};

export default Guidelines;
