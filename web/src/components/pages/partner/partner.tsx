import React from 'react';
import { Localized } from '@fluent/react';

import Page from '../../ui/page';

import './partner.css';
import PageHeading from '../../ui/page-heading';
import { LinkButton } from '../../ui/ui';
import { MailIcon } from '../../ui/icons';
import { COMMON_VOICE_EMAIL } from '../../../constants';

const Partner = () => (
  <Page className="partner-main-container">
    <section className="partnerships-section">
      <div className="partnerships-container">
        <div className="partnerships-header-text">
          <PageHeading>
            <Localized id="partnerships-header" />
          </PageHeading>
          <Localized id="partnerships-header-text">
            <p />
          </Localized>
          <LinkButton rounded blank href={`mailto:${COMMON_VOICE_EMAIL}`}>
            <MailIcon />
            <Localized id="partnerships-get-in-touch" />
          </LinkButton>
        </div>
        <div className="partnerships-header-image">
          <img
            src={require('./images/mozilla-common-voice_foundation-mars.png')}
            alt="robot"
          />
        </div>
      </div>
    </section>
    <section className="become-a-partner-section">
      <div className="become-a-partner-container">
        <h2>Become a Common Voice Partner</h2>
        <div className="become-a-partner-options">
          <div
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
            className="become-a-partner-community-option">
            <img
              src={require('./images/mozilla-common-voice_foundation.png')}
              alt="foundation"
              style={{ alignSelf: 'end' }}
            />
            <div style={{ flex: 0.8, marginTop: '30px' }}>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 400,
                  textAlign: 'left',
                  marginBottom: '16px',
                }}>
                Community, Creatives and Civil Society
              </h3>
              <p style={{ textAlign: 'left', fontWeight: 400, width: '650px' }}>
                The community is the beating heart of Common Voice - they come
                from all over the world, and are language activists and
                scientists and artists. You can learn more about how to get
                involved on our About page and in our Community playbook. If
                you&apos;re interested in deeper organisational partnership, get
                in touch.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Page>
);

export default Partner;
