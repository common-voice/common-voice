import * as React from 'react';
import { Localized } from '@fluent/react';
import { useState } from 'react';
import { TextButton } from '../../ui/ui';
import PageHeading from '../../ui/page-heading';

import './dataset-intro.css';

const DatasetIntro = () => {
  const [showIntroTextMdDown, setShow] = useState(false);

  return (
    <div className="dataset-intro">
      <PageHeading isLight>
        <Localized id="datasets-heading" />
      </PageHeading>

      <p className="intro-summary">
        <Localized id="datasets-headline" />
      </p>

      {!showIntroTextMdDown && (
        <Localized id="show-wall-of-text">
          <TextButton className="hidden-lg-up" onClick={() => setShow(true)} />
        </Localized>
      )}

      <Localized id="datasets-positioning">
        <p className={showIntroTextMdDown ? '' : 'hidden-md-down'} />
      </Localized>
    </div>
  );
};

export default DatasetIntro;
