import * as React from 'react';
import { PageContentType } from './types';
import { localeConnector } from '../../locale-helpers';
import { withLocalization, Localized } from '@fluent/react';
import RegisterSection from '../../register-section/register-section';
import KioskCard from './kiosk-card';
import { LinkButton } from '../../ui/ui';
import { ChevronRight, FlagIcon, ChevronLeft } from '../../ui/icons';
import URLS from '../../../urls';
import './create-account.css';
import { Link } from 'react-router-dom';

const getCreateAccountComponents = (): PageContentType => {
  const ContentComponent = () => {
    return (
      <div id="demo-create-account">
        <RegisterSection></RegisterSection>
      </div>
    );
  };

  const CardComponent = () => {
    return (
      <>
        <KioskCard.Top>
          <div
            id="inner-circle"
            className="demo-create-account-top-icon-circle">
            <FlagIcon />
          </div>
          <div
            id="outer-circle"
            className="demo-create-account-top-icon-circle-outer"></div>
          <div
            id="circle-shadow"
            className="demo-create-account-top-icon-circle-outer"></div>
        </KioskCard.Top>
        <KioskCard.Body>
          <h2>
            <Localized id="demo-account-card-header" />
          </h2>
          <p>
            <Localized id="demo-account-card-body" />
          </p>
          <div id="demo-account-sign-up">
            <Link to="voice.mozilla.org/login" id="signup-link" target="blank">
              voice.mozilla.org/login
            </Link>
          </div>
        </KioskCard.Body>
        <KioskCard.Bottom>
          <LinkButton to={URLS.DEMO} rounded>
            <ChevronLeft />
            <Localized id="card-button-back">
              <span />
            </Localized>
          </LinkButton>
          <LinkButton to={URLS.DEMO_CONTRIBUTE} rounded>
            <Localized id="card-button-next">
              <span />
            </Localized>
            <ChevronRight />
          </LinkButton>
        </KioskCard.Bottom>
      </>
    );
  };

  return {
    Content: localeConnector(withLocalization(ContentComponent)),
    Card: withLocalization(CardComponent),
  };
};

export default getCreateAccountComponents;
