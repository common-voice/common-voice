import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';
import Subscribe from './subscribe';
import Resources from './resources';

import './datasets.css';

export default () => (
  <div className="datasets-content">
    <DatasetInfo />
    <Subscribe />
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
          <Localized id="ready-to-validate">
            <h3 />
          </Localized>
        </div>
      </div>
    </div>
  </div>
);
