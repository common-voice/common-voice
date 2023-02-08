import * as React from 'react';
import { PageContentType } from './types';
import { withLocalization, Localized } from '@fluent/react';
import KioskCard from './kiosk-card';
import mars from './assets/mars.svg';
import { LinkButton } from '../../ui/ui';
import urls from '../../../urls';
import { ArrowRight, ChevronLeft, MicIcon, OldPlayIcon } from '../../ui/icons';
import { Link } from 'react-router-dom';
import { useLocale } from '../../locale-helpers';
import './contribute-intro.css';

const getContributeComponents = (): PageContentType => {
  const ContentComponent = () => {
    const [_, toLocaleRoute] = useLocale();
    return (
      <div id="demo-contribute-container">
        <div id="demo-contribute-speak-box">
          <div className="gradient"></div>
          <div className="demo-contribute-text">
            <Localized id="speak">
              <h1 className="contribute-title" />
            </Localized>
            <Localized id="speak-subtitle">
              <p className="contribute-subtitle" />
            </Localized>
            <Localized id="speak-paragraph">
              <p className="hidden-paragraph" />
            </Localized>
          </div>
          <div id="demo-contribute-speak-button">
            <Link
              to={toLocaleRoute(urls.DEMO_SPEAK)}
              className="contribute-button">
              <MicIcon />
            </Link>
            <div></div>
            <div id="speak-background"></div>
          </div>
        </div>
        <div id="demo-contribute-listen-box">
          <div className="gradient"></div>
          <div className="demo-contribute-text">
            <Localized id="listen">
              <h1 className="contribute-title" />
            </Localized>
            <Localized id="demo-listen-subtitle">
              <p className="contribute-subtitle" />
            </Localized>
            <Localized id="listen-paragraph">
              <p className="hidden-paragraph" />
            </Localized>
          </div>
          <div id="demo-contribute-listen-button">
            <Link
              to={toLocaleRoute(urls.DEMO_LISTEN)}
              className="contribute-button">
              <OldPlayIcon />
            </Link>
            <div id="listen-background"></div>
          </div>
        </div>
      </div>
    );
  };

  const CardComponent = () => (
    <>
      <KioskCard.Top>
        <div
          id="inner-circle"
          className="demo-contribute-kiosk-top-icon-circle">
          <img src={mars} alt="mini robot" />
        </div>
        <div
          id="outer-circle"
          className="demo-contribute-kiosk-top-icon-circle"></div>
        <div
          id="circle-shadow"
          className="demo-contribute-kiosk-top-icon-circle"></div>
      </KioskCard.Top>
      <KioskCard.Body>
        <Localized id="demo-contribute-card-header">
          <h2 />
        </Localized>
        <Localized id="demo-contribute-card-body" elems={{ br: <br /> }}>
          <p />
        </Localized>
        <LinkButton rounded to={urls.DEMO_SPEAK} id="demo-contribute-button">
          <Localized id="contribute">
            <span />
          </Localized>
          <ArrowRight />
        </LinkButton>
      </KioskCard.Body>
      <KioskCard.Bottom>
        <LinkButton rounded to={urls.DEMO_ACCOUNT} id="demo-contribute-back">
          <ChevronLeft />
          <Localized id="card-button-back">
            <span />
          </Localized>
        </LinkButton>
      </KioskCard.Bottom>
    </>
  );

  return {
    Content: withLocalization(ContentComponent),
    Card: withLocalization(CardComponent),
  };
};

export default getContributeComponents;
