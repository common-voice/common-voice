import * as React from 'react';

import DatasetInfo from './dataset-info';
import Resources from './resources';
import Page from '../../ui/page';
import { DonateBanner } from '../../donate-banner';

import './datasets.css';

const Datasets = () => (
  <Page className="datasets-content">
    <DatasetInfo />
    <Resources />
    <section className="donate-banner-section">
      <DonateBanner />
    </section>
  </Page>
);

export default Datasets;
