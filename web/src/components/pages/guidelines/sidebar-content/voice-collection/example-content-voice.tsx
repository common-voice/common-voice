import * as React from 'react';
import { Localized } from '@fluent/react';

import { CheckIcon, XMarkIcon } from '../../../../ui/icons';

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
        {exampleTips.map((tip, index) => (
          <div key={`${tip.text}${index}`} className="tip">
            <span className="circle">
              {tip.icon === 'check' ? (
                <CheckIcon className="check-icon" />
              ) : (
                <XMarkIcon />
              )}
            </span>
            <div className="tip-text-container">
              <Localized id={tip.text}>
                <p className="tip-text" />
              </Localized>
              {tip.explanation && (
                <Localized id={tip.explanation}>
                  <p className="tip-explanation" />
                </Localized>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
