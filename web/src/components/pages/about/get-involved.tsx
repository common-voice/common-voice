import * as React from 'react';
import { Localized } from '@fluent/react';
import { DiscourseLink, MatrixLink } from '../../shared/links';
import { DiscourseIconCode, MailIcon } from '../../ui/icons';
import { SECTIONS } from './constants';

import './get-involved.css';

const GetInvolved: React.ComponentType = () => {
  return (
    <>
      <img
        className="wave-footer"
        src={require('./images/wave-blue.svg')}
        alt=""
        role="presentation"
      />

      <div className="about-container">
        <div className="robot-section">
          <img src="/img/mars-3d.png" alt="Robot" />
        </div>

        <div className="text-section">
          <div className="line" />

          <Localized id="about-stay-in-touch">
            <h1 />
          </Localized>

          <p>
            <span className="round-button">
              <MailIcon />
            </span>
            <Localized
              id="about-stay-in-touch-text-1"
              elems={{
                emailFragment: <a href={`#${SECTIONS.SUBSCRIBE}`} />,
              }}>
              <span />
            </Localized>
          </p>

          <p>
            <span className="round-button">
              <DiscourseIconCode />
            </span>
            <Localized
              id="about-stay-in-touch-text-2"
              elems={{
                discourseLink: <DiscourseLink />,
                matrixLink: <MatrixLink />,
              }}>
              <span />
            </Localized>
          </p>
        </div>
      </div>
    </>
  );
};

export default GetInvolved;
