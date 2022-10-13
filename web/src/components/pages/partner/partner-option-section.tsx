import React from 'react';
import { Localized } from '@fluent/react';

import './partner-option-section.css';

type PartnerOptionProps = {
  option: string;
  elems: Record<string, JSX.Element>;
};

export const PartnerOptionSection: React.FC<PartnerOptionProps> = ({
  option,
  elems,
}) => {
  return (
    <div className="partner-options-container">
      <img
        src={require(`./images/mozilla-common-voice_foundation-${option}.png`)}
        alt={option}
      />
      <div className="partner-options-text-container">
        <Localized id={`partnerships-${option}-header`}>
          <h3>Community, Creatives and Civil Society</h3>
        </Localized>
        <Localized id={`partnerships-${option}-description`} elems={elems}>
          <p />
        </Localized>
      </div>
    </div>
  );
};
