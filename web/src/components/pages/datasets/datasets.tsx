import * as React from 'react';

import DatasetInfo from './dataset-info';
import Resources from './resources';
import Page from '../../ui/page';
import { DonateBanner } from '../../donate-banner';

import { useDonateBanner } from '../../../hooks/store-hooks';

import './datasets.css';

const Datasets = () => {
  const donateBanner = useDonateBanner();

  return (
    <Page className="datasets-content">
      <DatasetInfo />
      <Resources />
      <section className="donate-banner-section">
        <DonateBanner background={donateBanner.colour} />
      </section>
    </Page>
  );
};

export default Datasets;
