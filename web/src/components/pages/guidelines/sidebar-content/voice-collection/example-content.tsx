import React from 'react';
import { Localized } from '@fluent/react';

import { CheckIcon, XICon } from '../../../../ui/icons';

export type ExampleTip = {
  text: string;
  icon: 'check' | 'x';
  explanation?: string;
};

type ExampleContentProps = {
  exampleText: string;
  exampleTips: ExampleTip[];
};

export const ExampleContent: React.FC<ExampleContentProps> = ({
  exampleText,
  exampleTips,
}) => (
  <div className="example-container">
    <div className="example-text-container">
      <Localized id={exampleText}>
        <p />
      </Localized>
    </div>
    <div className="example-tips-container">
      <div>
        {exampleTips.map(tip => (
          <div key={tip.text} className="tip">
            <span className="circle">
              {tip.icon === 'check' ? (
                <CheckIcon className="check-icon" />
              ) : (
                <XICon />
              )}
            </span>
            <div className="tip-text">
              <Localized id={tip.text}>
                <p />
              </Localized>
              <Localized id={tip.explanation}>
                <p />
              </Localized>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
