import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';

export const Unsure = () => (
  <div className="sidebar-content" id={NAV_IDS.UNSURE}>
    <Localized id="just-unsure">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="just-unsure-explanation">
      <p className="guidelines-content-explanation" />
    </Localized>
  </div>
);
