import { Localized } from '@fluent/react';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink, useLocale } from '../../locale-helpers';
import { PlayOutlineIcon } from '../../ui/icons';
import DatasetInfo from './dataset-info';
import Subscribe from './subscribe';

import Resources from './resources';
import './datasets.css';

// Dear future searchers: the dataset survey modal, i.e.
// > “Have thoughts about the future of voice technology?”
// was removed in the same commit that added this comment.
export default () => (
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
          <Localized id="ready-to-validate">
            <h3 />
          </Localized>
        </div>
      </div>
    </div>
  </div>
);
