import * as React from 'react';
import { Localized } from '@fluent/react';

import PageHeading from '../../ui/page-heading';

import './why-common-voice.css';

const WhyCommonVoice: React.ComponentType<{}> = () => {
  return (
    <>
      <img
        className="wave-top"
        src={require('./images/wave-top.png')}
        alt="Wave"
      />

      <div className="about-container about-heading">
        <div className="about-header">
          <div className="about-header-text">
            <PageHeading>
              <Localized id="about-title" />
            </PageHeading>

            <Localized id="about-header-description-v2" elems={{ p: <p /> }}>
              <h2 className="header-description" />
            </Localized>
          </div>

          <div className="intro-img">
            <img
              className="robot"
              src={require('./images/robot.png')}
              alt="robot"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyCommonVoice;
