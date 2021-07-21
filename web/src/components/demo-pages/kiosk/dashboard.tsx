import * as React from 'react';
import { PageContentType } from './types';
import { withLocalization, Localized } from '@fluent/react';
import KioskCard from './kiosk-card';
import { LinkButton, Button } from '../../ui/ui';
import { ChevronRight, DashboardIcon, ChevronLeft } from '../../ui/icons';
import urls from '../../../urls';
import './dashboard.css';

const getDashboardComponents = (): PageContentType => {
  const ContentComponent = () => {
    const [activeLink, setActiveLink] = React.useState('STATS');
    const onStats = activeLink === 'STATS';
    const onGoals = activeLink == 'GOALS';

    return (
      <div id="demo-dashboard-container">
        <nav id="demo-dashboard-top-nav">
          <Button
            onClick={() => setActiveLink('STATS')}
            className={onStats ? 'active' : ''}>
            <Localized id="stats">
              <span />
            </Localized>
          </Button>
          <Button
            onClick={() => setActiveLink('GOALS')}
            className={onGoals ? 'active' : ''}>
            <Localized id="goals">
              <span />
            </Localized>
          </Button>
        </nav>
        <img
          src={require(onStats
            ? './assets/stats-screenshot.svg'
            : './assets/goals-screenshot.svg')}
        />
      </div>
    );
  };

  const CardComponent = () => {
    return (
      <>
        <KioskCard.Top>
          <div id="inner-circle" className="demo-dashboard-circle">
            <DashboardIcon />
          </div>
          <div id="outer-circle" className="demo-dashboard-circle"></div>
          <div id="circle-shadow" className="demo-dashboard-circle"></div>
        </KioskCard.Top>
        <KioskCard.Body>
          <Localized id="demo-dashboard-card-header">
            <h2 />
          </Localized>
          <Localized id="demo-dashboard-card-body" elems={{ br: <br /> }}>
            <p id="card-body-text" />
          </Localized>
        </KioskCard.Body>
        <KioskCard.Bottom>
          <LinkButton to={urls.DEMO_DATASETS} rounded>
            <ChevronLeft />
            <Localized id="card-button-back">
              <span />
            </Localized>
          </LinkButton>
          <LinkButton to={urls.DEMO_ACCOUNT} rounded>
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
    Content: withLocalization(ContentComponent),
    Card: withLocalization(CardComponent),
  };
};

export default getDashboardComponents;
