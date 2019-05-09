import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import {
  GitHubLink,
  DiscourseLink,
  ContactLink,
  SlackLink,
} from '../../shared/links';
import {
  GithubIconCode,
  DiscourseIconCode,
  SlackIcon,
  ContactIconCode,
  ArrowLeft,
} from '../../ui/icons';
import { Button } from '../../ui/ui';

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
          slackLink={<SlackLink />}>
          <p />
        </Localized>

        <div className="get-involved-icons">
          {[
            [DiscourseLink, DiscourseIconCode],
            [GitHubLink, GithubIconCode],
            [SlackLink, SlackIcon],
            [ContactLink, ContactIconCode],
          ].map(([LinkComponent, IconComponent]: [any, any], index: number) => (
            <LinkComponent
              key={`get-involved-icon-${index}`}
              className="round-button">
              <IconComponent />
            </LinkComponent>
          ))}
        </div>
      </div>
    </>
  );
};

export default GetInvolved;
