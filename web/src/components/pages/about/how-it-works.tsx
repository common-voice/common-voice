import * as React from 'react';
import * as cx from 'classnames';
import { Localized } from '@fluent/react';
import { CheckIcon, HexIcon } from '../../ui/icons';

import './how-it-works.css';

type HowItWorksType = {
  title: string;
  subtitle: string;
};

const howItWorksContent: HowItWorksType[] = [
  {
    title: 'request-language-title',
    subtitle: 'about-language-req-subtitle',
  },
  {
    title: 'about-localization-title',
    subtitle: 'about-localization-subtitle',
  },
  {
    title: 'about-sentence-collection-title',
    subtitle: 'about-sentence-collection-subtitle',
  },
  {
    title: 'about-new-lang-title',
    subtitle: 'about-new-lang-subtitle',
  },
  {
    title: 'about-voice-contrib-title',
    subtitle: 'about-voice-contrib-subtitle',
  },
  {
    title: 'about-voice-validation-title',
    subtitle: 'about-voice-validation-subtitle',
  },
  {
    title: 'about-dataset-release-title',
    subtitle: 'about-dataset-release-subtitle',
  },
];

const HowItWorks = React.memo(() => {
  return (
    <div className="how-it-works-container">
      <div className="how-it-works-intro">
        <Localized id="how-does-it-work-title-v2">
          <h2 />
        </Localized>
        <Localized id="how-does-it-work-text">
          <p />
        </Localized>
      </div>
      {howItWorksContent.map((howBlock: HowItWorksType, i: number) => {
        return (
          <div className="how-it-works-block" key={i}>
            <div
              className={`how-it-works-icon ${
                i + 1 === howItWorksContent.length ? 'done' : ''
              }`}>
              {i + 1}
            </div>
            <Localized id={howBlock.title}>
              <h3 />
            </Localized>
            <Localized id={howBlock.subtitle}>
              <p />
            </Localized>
          </div>
        );
      })}
    </div>
  );
});

export default HowItWorks;
