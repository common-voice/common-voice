import * as React from 'react';
import { Localized } from '@fluent/react';
import { useState } from 'react';
import { TextButton } from '../../ui/ui';
import PageHeading from '../../ui/page-heading';

import './dataset-intro.css';
import classNames from 'classnames';

const DatasetIntro = () => {
  const [showIntroTextMdDown, setShow] = useState(false);

  return (
    <div className="dataset-intro">
      <div>
        <PageHeading isLight>
          <Localized id="datasets-heading" />
          <p className="intro-summary">
            <Localized id="datasets-headline" />
          </p>
        </PageHeading>
      </div>

      <div>
        {!showIntroTextMdDown && (
          <Localized id="show-wall-of-text">
            <TextButton
              className="hidden-lg-up"
              onClick={() => setShow(true)}
            />
          </Localized>
        )}
        <Localized id="datasets-positioning">
          <p
            className={classNames({ 'hidden-md-down': !showIntroTextMdDown })}
          />
        </Localized>
      </div>
    </div>
  );
};

export default DatasetIntro;
