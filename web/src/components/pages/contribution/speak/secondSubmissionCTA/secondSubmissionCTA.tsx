import * as React from 'react';
import { Localized } from '@fluent/react';
import Confetti from 'react-confetti';

import useWindowSize from '../../../../../hooks/use-window-size';

import './secondSubmissionCTA.css';
import { Button, LinkButton } from '../../../../ui/ui';

type SecondPostSubmissionCtaProps = {
  onReset: () => void;
};

export const SecondPostSubmissionCTA: React.FC<
  SecondPostSubmissionCtaProps
> = ({ onReset }) => {
  const { height, width } = useWindowSize();

  const confettiSourceObject = {
    w: 10,
    h: 10,
    x: width / 2,
    y: height / 2.5,
  };

  return (
    <div data-testid="second-submission-cta">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        gravity={0.1}
        recycle={false}
        initialVelocityX={8}
        initialVelocityY={14}
        opacity={70}
        confettiSource={confettiSourceObject}
        tweenDuration={7000}
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
              <h1 className="header-text" />
            </Localized>
          </div>
        </div>

        <div className="subtitle-text-container">
          <Localized id="second-cta-subtitle-text">
            <h2 className="subtitle-text" />
          </Localized>
        </div>

        <div className="submission-buttons">
          <Localized id="create-profile-button">
            <LinkButton
              rounded
              className="create-profile-button"
              data-testid="create-profile-button"
              href="/login"
            />
          </Localized>
          <Localized id="continue-speaking-button">
            <Button
              rounded
              data-testid="continue-speaking-button"
              onClick={onReset}
            />
          </Localized>
        </div>

        <Localized
          id="already-have-an-account"
          elems={{
            login: <a href="/login" />,
          }}>
          <p className="login-text" />
        </Localized>
      </div>
    </div>
  );
};
