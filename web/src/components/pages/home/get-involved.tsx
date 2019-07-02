import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import {
  GitHubLink,
  DiscourseLink,
  //ContactLink,
  SlackLink,
  AlmannaLink,
} from '../../shared/links';

import './get-involved.css';

const GetInvolved: React.ComponentType = () => {
  return (
    <>
      <img
        className="wave-footer"
        src={require('./images/wave-footer@3x.png')}
        alt="Wave"
      />

      {/*<div className="become-partner">
        <ContactLink>
          <Localized id="about-become-a-partner">
            <span />
          </Localized>
          <ArrowLeft />
        </ContactLink>
      </div>*/}

      <div className="robot-section">
        <img src={require('./images/robot-footer.svg')} alt="Robot" />
      </div>

      <div className="text-section">
        <div className="line" />

        <Localized id="about-get-involved">
          <h1 />
        </Localized>

        <Localized
          id="about-get-involved-text"
          discourseLink={<DiscourseLink />}
          githubLink={<GitHubLink />}
          slackLink={<SlackLink />}
          almannaLink={<AlmannaLink />}>
          <p />
        </Localized>
      </div>
    </>
  );
};

export default GetInvolved;
