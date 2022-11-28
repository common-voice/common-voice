import * as React from 'react';
import { Localized } from '@fluent/react';
import Confetti from 'react-confetti';

import useWindowSize from '../../../../../hooks/use-window-size';

import './secondSubmissionCTA.css';

export const SecondPostSubmissionCTA = () => {
  const { height, width } = useWindowSize();

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.03}
      />
      <div className="second-cta-container">
        <div className="header-container">
          <div className="happy-mars-container">
            <img
              src={require('./images/happy-mars@2x.png')}
              alt="Happy Mars"
              width={175}
              height={175}
            />
          </div>
          <div className="header-text-container">
            <Localized id="second-cta-header-text">
              <h1 className="header-text">
                Thank you for contributing your voice!
              </h1>
            </Localized>
          </div>
        </div>

        <div>
          <div className="subtitle-text-container">
            <Localized id="second-cta-subtitle-text">
              <h2 className="subtitle-text">
                With a profile, you can keep track of your activity and connect
                with a community of voice data contributors.
              </h2>
            </Localized>
          </div>
        </div>
      </div>
    </>
  );
};
