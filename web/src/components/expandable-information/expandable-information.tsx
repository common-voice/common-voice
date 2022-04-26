import * as React from 'react';
import { Localized } from '@fluent/react';

import { ChevronDown } from '../ui/icons';

import './expandable-information.css';

interface Props {
  summaryLocalizedId: string;
  children: React.ReactNode;
}

const ExpandableInformation = ({ summaryLocalizedId, children }: Props) => {
  return (
    <details className="expandable-information">
      <summary className="expandable-information__summary">
        <Localized id={summaryLocalizedId}>
          <span />
        </Localized>

        <ChevronDown className="expandable-information__summary__arrow" />
      </summary>
      <div className="expandable-information__text">{children}</div>
    </details>
  );
};

export default ExpandableInformation;
