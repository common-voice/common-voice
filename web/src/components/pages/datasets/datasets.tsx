import { Localized } from '@fluent/react';
import * as React from 'react';

import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';
import Resources from './resources';
import Page from '../../ui/page';

import './datasets.css';

const Datasets = () => (
  <Page className="datasets-content">
    <DatasetInfo />
    <Resources />
    <div className="mars-validate">
      <div>
        <img src={require('./images/mars.svg')} alt="" />
      </div>
      <div>
        <div className="cta-container">
          <LocaleLink to={URLS.LISTEN}>
            <PlayOutlineIcon />
          </LocaleLink>
          <h3>
            <Localized id="ready-to-validate" />
          </h3>
        </div>
      </div>
    </div>
  </Page>
);

export default Datasets;
