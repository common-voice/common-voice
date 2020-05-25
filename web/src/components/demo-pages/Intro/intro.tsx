import * as React from 'react';
import robot from './assets/Red.svg';
import './intro.css';
import { Localized, withLocalization } from 'fluent-react/compat';
import { LinkButton } from '../../ui/ui';
import { ArrowRight } from '../../ui/icons';
import URLS from '../../../urls';

export default withLocalization(function Intro() {
  return (
    <div className="container">
      <div className="layer"></div>
      <img src={robot} id="robot" alt="red robot" />
      <div className="text">
        <Localized id="demo-welcome">
          <h1 className="text-header" />
        </Localized>
        <Localized id="demo-welcome-subheader">
          <p className="text-body" />
        </Localized>
      </div>
      <LinkButton rounded to={URLS.DEMO_DATASETS} className="btn-get-started">
        <Localized id="demo-get-started">
          <span />
        </Localized>
        <ArrowRight id="arrow-right" />
      </LinkButton>
    </div>
  );
});
