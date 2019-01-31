import * as React from 'react';
import DatasetInfo from './dataset-info';
import Subscribe from './subscribe';
import Resources from './resources';

import './datasets.css';

export default () => (
  <div className="datasets">
    <DatasetInfo />
    <Subscribe />
    <Resources />
  </div>
);
