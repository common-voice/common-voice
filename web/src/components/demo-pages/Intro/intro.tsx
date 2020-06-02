import * as React from 'react';
import robot from './assets/Red.svg';
import './intro.css';
import { Localized, withLocalization } from 'fluent-react/compat';
import { LinkButton } from '../../ui/ui';
import { ArrowRight } from '../../ui/icons';
import URLS from '../../../urls';

export default withLocalization(function Intro() {
  return (
    <div id="intro-container">
      <div id="intro-container--gradient-layer"></div>
      <img src={robot} id="robot" alt="red robot" />
      <div id="intro-container--text-box">
        <Localized id="demo-welcome">
          <h1 id="intro-container--text-box__text-header" />
        </Localized>
        <Localized id="demo-welcome-subheader">
          <p id="intro-container--text-box__text-body" />
        </Localized>
      </div>
      <LinkButton
        rounded
        to={URLS.DEMO_DATASETS}
        id="intro-container--btn-get-started">
        <Localized id="demo-get-started">
          <span />
        </Localized>
        <ArrowRight id="arrow-right" />
      </LinkButton>
    </div>
  );
});
