import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Localized } from '@fluent/react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import classNames from 'classnames';

import Page from '../../ui/page';
import PageHeading from '../../ui/page-heading';
import { NAV_IDS } from './constants';
import SidebarContent from './sidebar-content/sidebar-content';
import RoundButton from '../../ui/round-button';
import { MailIcon } from '../../ui/icons';
import VisuallyHidden from '../../visually-hidden/visually-hidden';

import './guidelines.css';

const Guidelines = () => {
  const defaultOption = NAV_IDS.PRONUNCIATIONS;

  const [selectedOption, setSelectedOption] = useState(defaultOption);

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
                <Tab selectedClassName="selected-tab" className="tab" />
              </Localized>
              <Localized id="sentence-collection">
                <Tab selectedClassName="selected-tab" className="tab" />
              </Localized>
            </TabList>
          </div>

          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <nav>
              <ul>
                {Object.keys(NAV_IDS).map(key => (
                  <li key={NAV_IDS[key]}>
                    <div className="line" />
                    <a
                      href={`#${NAV_IDS[key]}`}
                      onClick={() => setSelectedOption(NAV_IDS[key])}
                      className={classNames({
                        'selected-option': NAV_IDS[key] === selectedOption,
                      })}>
                      <Localized id={NAV_IDS[key]} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="sections">
              <SidebarContent />
            </div>
          </TabPanel>
          <TabPanel selectedClassName="tabpanel--selected" className="tabpanel">
            <h2>Any content 2</h2>
          </TabPanel>
        </Tabs>
      </section>
      <section className="contact-section">
        <div className="contact-container">
          <Localized id="still-have-questions">
            <h1 />
          </Localized>
          <p>
            <RoundButton>
              <Link to="#" data-testid="email-signup-button">
                <VisuallyHidden>
                  <Localized id="about-stay-in-touch-button" />
                </VisuallyHidden>
                <MailIcon />
              </Link>
            </RoundButton>
            <Localized id="about-stay-in-touch-text-1">
              <span />
            </Localized>
          </p>
        </div>
      </section>
    </Page>
  );
};

export default Guidelines;
