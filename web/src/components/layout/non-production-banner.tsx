import * as React from 'react';
import { useState } from 'react';

import URLS from '../../urls';
import { isProduction } from '../../utility';

import './non-production-banner.css';

const NonProductionBanner = () => {
  const [hide, setHide] = useState(isProduction());

  if (hide) {
    return null;
  }

  return (
    <div className="non-production-banner">
      <span>
        <span aria-hidden={true}>⚠️</span> You&apos;re not on{' '}
        <a href={URLS.HTTP_ROOT}>the production website</a>. Voice data is not
        collected here.
      </span>
      <button onClick={() => setHide(true)}>Close</button>
    </div>
  );
};

export default NonProductionBanner;
