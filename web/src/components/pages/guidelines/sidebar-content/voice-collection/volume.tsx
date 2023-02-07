import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';

export const Volume = () => (
  <div className="sidebar-content" id={NAV_IDS.VOLUME}>
    <Localized id="volume">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="volume-explanation">
      <p className="guidelines-content-explanation" />
    </Localized>
    <span className="border" />
  </div>
);
