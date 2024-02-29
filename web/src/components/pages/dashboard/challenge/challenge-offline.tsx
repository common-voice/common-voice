import * as React from 'react';
import { useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { LocaleLink } from '../../../locale-helpers';
import { ChallengeDuration } from 'common';
import { isBeforeChallenge } from './constants';
import { LinkButton } from '../../../ui/ui';
import URLS from '../../../../urls';
import { Notifications } from '../../../../stores/notifications';
import { useAction } from '../../../../hooks/store-hooks';
import './challenge-offline.css';

function ChallengeOffline({
  duration,
  location,
}: { duration: ChallengeDuration } & RouteComponentProps<any, any, any>) {
  const addAchievement = useAction(Notifications.actions.addAchievement);
  const dateFormat = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  } as Intl.DateTimeFormatOptions;

  useEffect(() => {
    if (isBeforeChallenge && location.state?.earlyEnroll) {
      addAchievement(
        50,
        'Bonus! You signed up in time for some extra points.',
        'success'
      );
    }
  }, []);

  return isBeforeChallenge(duration) ? (
    <div className="challenge-blank-state pre-challenge">
      <div className="challenge-cta">
        <h1 className="challenge-header">
          The Open Voice Challenge will start on{' '}
          {duration.start.toLocaleString('en-US', dateFormat)}
        </h1>
        <div>
          <LocaleLink className="speak-btn" to={URLS.SPEAK}>
            Speak
            <span className="speak-icon"></span>
          </LocaleLink>
          <LocaleLink className="listen-btn" to={URLS.LISTEN}>
            Listen
            <span className="listen-icon"></span>
          </LocaleLink>
        </div>
        <p className="challenge-alt">
          In the mean time you can still contribute to Common Voice
        </p>
      </div>
    </div>
  ) : (
    <div className="challenge-blank-state post-challenge">
      <div className="challenge-cta">
        <h1 className="challenge-header">
          While you wait for the next one, create a custom goal!
        </h1>
        <LinkButton className="custom-goal-button" rounded to={URLS.GOALS}>
          Create a custom goal
        </LinkButton>
      </div>
    </div>
  );
}

export default withRouter(ChallengeOffline);
