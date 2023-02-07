import { Localized } from '@fluent/react';
import React from 'react';

import { NAV_IDS } from '../../constants';

export const OffensiveContent = () => (
  <div className="sidebar-content" id={NAV_IDS.OFFENSIVE_CONTENT}>
    <Localized id="offensive-content">
      <h3 className="guidelines-content-heading" />
    </Localized>
    <Localized
      id="offensive-content-explanation"
      elems={{
        participationGuidelines: (
          <a
            href="https://www.mozilla.org/en-US/about/governance/policies/participation/"
            target="_blank"
            rel="noreferrer"
          />
        ),
        emailFragment: (
          <a
            href="mailto:commonvoice@mozilla.com"
            target="_blank"
            rel="noreferrer"
          />
        ),
      }}>
      <p className="guidelines-content-explanation" />
    </Localized>
    <span className="border" />
  </div>
);
