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
      <div className="partner-container">
        <div className="partner-header-text">
          <PageHeading>
            <Localized id="partnerships-header" />
          </PageHeading>
          <p>
            It takes a lot to make Common Voice happen! We don&apos;t do it
            alone. Want to partner with us? We&apos;d love to hear from you.
          </p>
          <LinkButton rounded blank href={`mailto:${COMMON_VOICE_EMAIL}`}>
            <MailIcon />
            <Localized id="partnerships-get-in-touch" />
          </LinkButton>
        </div>
        <div className="partner-header-image">
          <img
            src={require('./images/mozilla-common-voice_foundation-mars.png')}
            alt="robot"
          />
        </div>
      </div>
    </section>
  </Page>
);

export default Partner;
