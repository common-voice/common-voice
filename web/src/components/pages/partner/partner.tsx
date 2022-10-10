import React from 'react';
import { Localized } from '@fluent/react';

import { Line } from '../../ui/line/line';
import Page from '../../ui/page';

import './partner.css';

const Partner = () => (
  <Page className="partner-main-container">
    <section className="partnerships-section">
      <div className="partner-container">
        <Line />
        <Localized id="partnerships-header">
          <h1 />
        </Localized>
      </div>
    </section>
  </Page>
);

export default Partner;
