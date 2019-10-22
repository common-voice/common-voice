import * as React from 'react';
import { useState } from 'react';
import Props from '../props';
import WeeklyChallenge from './weekly-challenge';
import LeaderBoardCard from './leaderboard-card';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import { User } from '../../../../stores/user';
import { CrossIcon, InfoIcon } from '../../../ui/icons';
import './challenge.css';

const Overlay = ({ hideOverlay }: { hideOverlay?: () => void }) => {
  const account = useAccount();
  const saveAccount = useAction(User.actions.saveAccount);
  return (
    <div className="leaderboard-overlay">
      <button className="close-overlay" type="button" onClick={hideOverlay}>
        <CrossIcon />
      </button>
      <h2>Leaderboard Visibility</h2>
      <div className="toggle-input">
        <input
          type="checkbox"
          defaultChecked={Boolean(account.visible)}
          onChange={(event: any) => {
            saveAccount({ visible: event.target.checked });
          }}
        />
        <div>Hidden</div>
        <div>Visible</div>
      </div>
      <p className="explainer">
        This setting controls your leaderboard visibility. When hidden, your
        progress will be private. This means your image, user name and progress
        will not appear on the leaderboard.
      </p>
      <div className="info">
        <InfoIcon />
        <p className="note">
          Note: When set to 'Visible', this setting can be changed from the{' '}
          <LocaleLink to={URLS.PROFILE_INFO}>Profile page</LocaleLink>
        </p>
      </div>
    </div>
  );
};

export default function ChallengePage({ dashboardLocale }: Props) {
  const [showOverlay, setShowOverlay] = useState(false);
  return (
    <div className="challenge challenge-container">
      <WeeklyChallenge />
      <div className={`range-container ${showOverlay ? 'has-overlay' : ''}`}>
        {showOverlay && <Overlay hideOverlay={() => setShowOverlay(false)} />}
        <div className="leader-board">
          <LeaderBoardCard
            title="SAP Team Progress"
            showVisibleIcon
            showOverlay={() => setShowOverlay(true)}
          />
        </div>
        <div className="leader-board">
          <LeaderBoardCard title="Overall Challenge Top Team" />
        </div>
        <div className="leader-board">
          <LeaderBoardCard
            title="Overall Challenge Top Contributors"
            showVisibleIcon
            showOverlay={() => setShowOverlay(true)}
          />
        </div>
      </div>
    </div>
  );
}
