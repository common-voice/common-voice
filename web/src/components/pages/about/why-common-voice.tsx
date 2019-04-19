import * as React from 'react';
import { Localized } from 'fluent-react/compat';

const WhyCommonVoice: React.ComponentType<{}> = () => {
  return (
    <>
      <img
        className="wave-top"
        src={require('./images/wave-top.png')}
        alt="Wave"
      />

      <div className="about-container heading">
        <div className="about-header">
          <div className="text">
            <div className="line" />

            <Localized id="about-title">
              <h1 />
            </Localized>

            <Localized id="about-subtitle">
              <h2 />
            </Localized>

            <Localized id="about-header-description">
              <h2 className="header-description" />
            </Localized>
          </div>

          <div className="intro-img">
            <img
              className="robot"
              src={require('./images/robot.png')}
              alt="Waves"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyCommonVoice;
