import Slider from './slider';
import * as React from 'react';
import { Button } from '../../ui/ui';
import { ArrowLeft } from '../../ui/icons';
import { Localized } from '@fluent/react';
import { ContactLink } from '../../shared/links';

import './partners.css';

const Partners: React.ComponentType = () => {
  return (
    <>
      <div className="about-container partner-description">
        <div className="first-column">
          <div className="line" />
          <div className="vertical-line" />
          <Localized id="about-partners">
            <h1 />
          </Localized>

          <ContactLink>
            <Button className="become-a-partner" rounded>
              <Localized id="about-become-a-partner">
                <span />
              </Localized>
              <ArrowLeft />
            </Button>
          </ContactLink>
        </div>

        <Localized id="about-partnership">
          <p className="second-column" />
        </Localized>
      </div>

      <Slider />
    </>
  );
};

export default Partners;
