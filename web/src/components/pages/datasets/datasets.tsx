import * as React from 'react';

import DatasetInfo from './dataset-info';
import Resources from './resources';
import Page from '../../ui/page';

const Datasets = () => (
  <Page className="datasets-content">
    <DatasetInfo />
    <Resources />
  </Page>
);

export default Datasets;
