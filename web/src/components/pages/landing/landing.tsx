import { Localized } from '@fluent/react';
import * as React from 'react';
import { trackLanding } from '../../../services/tracker';
import { useTypedSelector } from '../../../stores/tree';
import URLS from '../../../urls';
import RegisterSection from '../../register-section/register-section';
import { ArrowLeft } from '../../ui/icons';
import { LinkButton } from '../../ui/ui';

import './landing.css';

export default function Landing() {
  const hasAccount = useTypedSelector(({ user }) => Boolean(user?.account));
  return (
    <div className="partner-landing">
      <div className="partner-header">
        <img
          src={require('./sodedif.png')}
          alt="Sodedif Logo"
          style={{ padding: 10, height: 50 }}
        />
      </div>
      <RegisterSection flipped marsSrc={require('./mars.svg')}>
        <Localized id="welcome-staff" vars={{ company: 'Sodedif' }}>
          <h1 />
        </Localized>
        <Localized id="help-contribute">
          <p className="main-paragraph" />
        </Localized>
        {hasAccount ? (
          <Localized id="speak-subtitle">
            <LinkButton
              rounded
              to={URLS.SPEAK}
              onClick={() => trackLanding('speak')}
            />
          </Localized>
        ) : (
          <Localized id="login-company" vars={{ company: 'Sodedif' }}>
            <LinkButton
              rounded
              href="/voicewall/login"
              onClick={() => trackLanding('profile')}
            />
          </Localized>
        )}
        <Localized id="profile-not-required">
          <p className="profile-not-required" />
        </Localized>
      </RegisterSection>

      <section className="about-section">
        <div className="inner">
          <Localized id="default-tagline">
            <h1 />
          </Localized>

          <LinkButton
            rounded
            to={URLS.ABOUT}
            onClick={() => trackLanding('about')}>
            <Localized id="show-wall-of-text">
              <div className="hidden-md-up" />
            </Localized>
            <Localized id="read-more-about">
              <div className="hidden-sm-down" />
            </Localized>
            <ArrowLeft />
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
