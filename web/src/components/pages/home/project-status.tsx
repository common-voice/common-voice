import * as React from 'react';
import { Link } from 'react-router-dom';
import { trackNavigation } from '../../../services/tracker';

const VALIDATED_HOURS = 200;
const GOAL_HOURS = 500;

export default () => (
  <div className="project-status">
    <div className="title-and-action">
      <h4>Overall project status: see how far we've come!</h4>
      <Link to="/record" onClick={() => trackNavigation('progress-to-record')}>
        Contribute your voice
      </Link>
    </div>

    <div className="contents">
      <div className="language-progress">
        <b>ENGLISH</b>
        <div className="progress-bar">
          <div
            className="validated-hours"
            style={{ width: 100 * VALIDATED_HOURS / GOAL_HOURS + '%' }}
          />
        </div>
        <div className="numbers">
          <div>{VALIDATED_HOURS} validated hours so far!</div>
          <div>Next Goal: {GOAL_HOURS}</div>
        </div>
      </div>

      <div>
        Second language coming soon!
        <div className="progress-bar" />
      </div>
    </div>
  </div>
);
