import * as React from 'react';
import { Localized } from '@fluent/react';

import {
  MicIcon,
  PlayOutlineGreenIcon,
  CloseIcon,
  CloudIcon,
  UserIcon,
} from '../../ui/icons';
import { Link } from 'react-router-dom';
import { useLocale } from '../../locale-helpers';
import urls from '../../../urls';
import grid from './assets/grid.svg';
import home from './assets/home.svg';
import upload from './assets/upload.svg';
import { PageContentType } from './types';
import NotSupported from '../not-supported';

import './kiosk.css';

const BottomRightPane = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [_, toLocaleRoute] = useLocale();
  return (
    <nav id="kiosk-bottom-right-pane">
      {expanded ? (
        <ul id="kiosk-bottom-right-pane__expanded">
          <li id="top" className="kiosk-bottom-right-pane__expanded--options">
            <Link
              id="kiosk-bottom-right-pane__expanded--speak"
              to={toLocaleRoute(urls.DEMO_SPEAK)}>
              <MicIcon />
              <Localized id="speak">
                <span />
              </Localized>
            </Link>
            <Link
              id="kiosk-bottom-right-pane__expanded--listen"
              to={toLocaleRoute(urls.DEMO_LISTEN)}>
              <PlayOutlineGreenIcon />
              <Localized id="listen">
                <span />
              </Localized>
            </Link>
          </li>
          <ul id="middle">
            <li>
              <Link to={toLocaleRoute(urls.DATASETS)}>
                <CloudIcon />
                <Localized id="datasets">
                  <span />
                </Localized>
              </Link>
            </li>
            <li>
              <Link to={toLocaleRoute(urls.DEMO_ACCOUNT)}>
                <UserIcon />
                <Localized id="demo-account">
                  <span />
                </Localized>
              </Link>
            </li>
            <li>
              <Link to={toLocaleRoute(urls.DEMO_CONTRIBUTE)}>
                <img src={upload} alt="contribute" />
                <Localized id="contribute">
                  <span />
                </Localized>
              </Link>
            </li>
          </ul>
          <li
            id="bottom"
            className="kiosk-bottom-right-pane__expanded--options">
            <Link
              to={toLocaleRoute(urls.DEMO)}
              id="kiosk-bottom-right-pane__expanded--home">
              <img src={home} alt="home" />
            </Link>
            <button
              id="kiosk-bottom-right-pane__expanded--close"
              onClick={() => setExpanded(false)}>
              <CloseIcon id="close-icon" black />
            </button>
          </li>
        </ul>
      ) : (
        <ul id="kiosk-bottom-right-pane__collapsed">
          <li id="pane__micIcon">
            <Link to={toLocaleRoute(urls.DEMO_SPEAK)}>
              <MicIcon alt="speak" />
            </Link>
          </li>
          <li>
            <Link to={toLocaleRoute(urls.DEMO_LISTEN)}>
              <PlayOutlineGreenIcon alt="listen" />
            </Link>
          </li>
          <hr id="pane-divider" />
          <li onClick={() => setExpanded(true)}>
            <button id="expand-menu-button">
              <img src={grid} alt="menu" />
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

interface KioskProps {
  pageContent: PageContentType;
}

function Kiosk(props: KioskProps) {
  const { pageContent } = props;

  return (
    <>
      <NotSupported />
      <div id="kiosk-container">
        <div id="pattern-bg">
          <div id="gradient"></div>
          <div id="mesh"></div>
        </div>
        <div id="kiosk-card">
          <pageContent.Card />
        </div>
        <BottomRightPane />
        <div id="kiosk--content">
          <pageContent.Content />
        </div>
      </div>
    </>
  );
}

export default Kiosk;
