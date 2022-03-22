import { Localized } from '@fluent/react';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';

import Resources from './resources';
import './datasets.css';

// Dear future searchers: the dataset survey modal, i.e.
// > “Have thoughts about the future of voice technology?”
// was removed in the same commit that added this comment.
const Datasets = () => (
  <div className="datasets-content">
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
  </div>
);

export default Datasets;
