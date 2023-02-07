import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';

export const Effects = () => (
  <div className="sidebar-content" id={NAV_IDS.EFFECTS}>
    <Localized id="reader-effects">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized id="reader-effects-explanation">
      <p className="guidelines-content-explanation" />
    </Localized>
    <span className="border" />
  </div>
);
