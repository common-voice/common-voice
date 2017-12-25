import * as React from 'react';
import { Link } from 'react-router-dom';
import STRINGS from '../../../../localize-strings';
const VALIDATED_HOURS = 200;
const GOAL_HOURS = 500;

export default () => (
  <div className="project-status">
    <div className="title-and-action">
      <h4>{STRINGS.projectStatusHeader}</h4>
      <Link to="/record">{STRINGS.homeDonateVoice}</Link>
    </div>

    <div className="contents">
      <div className="language-progress">
        <b>{STRINGS.langAllCapital}</b>
        <div className="progress-bar">
          <div
            className="validated-hours"
            style={{ width: 100 * VALIDATED_HOURS / GOAL_HOURS + '%' }}
          />
        </div>
        <div className="numbers">
          <div>
            {VALIDATED_HOURS}
            {STRINGS.projectStatusValidateHours}
          </div>
          <div>
            {STRINGS.projectStatusNextGoal}
            {GOAL_HOURS}
          </div>
        </div>
      </div>

      <div>
        {STRINGS.projectStatusSoon}
        <div className="progress-bar" />
      </div>
    </div>
  </div>
);
