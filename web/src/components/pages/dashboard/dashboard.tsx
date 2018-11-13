import * as React from 'react';
import ProgressBox from './progress-box';

import './dashboard.css';

export default () => (
  <div className="dashboard-page">
    <div className="inner">
      <div className="title-bar">
        <h1>Stats</h1>
        <div className="languages" />
      </div>

      <div className="progress-boxes">
        <ProgressBox type="clips" />
        <ProgressBox type="votes" />
      </div>
    </div>
  </div>
);
