import * as React from 'react';
import { Localized } from '@fluent/react';
import { Link } from 'react-router-dom';
import { DiscourseLink, MatrixLink } from '../../shared/links';
import { DiscourseIconCode, MailIcon } from '../../ui/icons';
import RoundButton from '../../ui/round-button';
import VisuallyHidden from '../../visually-hidden/visually-hidden';
import { SECTIONS } from './constants';

import './get-involved.css';

type Props = {
  basketToken?: string;
};

const GetInvolved: React.FC<Props> = ({ basketToken }) => {
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

          {!basketToken && (
            <p>
              <RoundButton>
                <Link
                  to={`#${SECTIONS.SUBSCRIBE}`}
                  data-testid="email-signup-button">
                  <VisuallyHidden>
                    <Localized id="about-stay-in-touch-button" />
                  </VisuallyHidden>
                  <MailIcon />
                </Link>
              </RoundButton>
              <Localized
                id="about-stay-in-touch-text-1"
                elems={{
                  emailFragment: <a href={`#${SECTIONS.SUBSCRIBE}`} />,
                }}>
                <span />
              </Localized>
            </p>
          )}

          <p>
            <RoundButton>
              <DiscourseLink data-testid="discourse-button">
                <VisuallyHidden>Discourse</VisuallyHidden>
                <DiscourseIconCode />
              </DiscourseLink>
            </RoundButton>
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
