import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import WeeklyChallenge from './weekly-challenge';
import LeaderBoardCard from './leaderboard-card';
import TeamBoardCard from './team-card';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import { User } from '../../../../stores/user';
import { CrossIcon, InfoIcon } from '../../../ui/icons';
import { LabeledCheckbox } from '../../../ui/ui';
import { trackChallenge } from '../../../../services/tracker';
import './challenge.css';

const Overlay = ({ hideOverlay }: { hideOverlay?: () => void }) => {
  const account = useAccount();
  const saveAccount = useAction(User.actions.saveAccount);
  const [radio, setVisibleRadio] = useState(account.visible);
  const visibleForTeam = useRef(null);
  const visibleForAll = useRef(null);
  const VISIBLE_FOR_TEAM = 2;
  const VISIBLE_FOR_ALL = 1;
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
            setVisibleRadio(event.target.checked);
            if (!event.target.checked) {
              saveAccount({ visible: 0 });
            }
          }}
        />
        <div>Hidden</div>
        <div>Visible</div>
      </div>
      {Boolean(radio) && (
        <div className="visible-btns">
          <LabeledCheckbox
            label="Visible for all"
            defaultChecked={account.visible === VISIBLE_FOR_ALL}
            ref={visibleForAll}
            onChange={(event: any) => {
              if (event.target.checked) {
                saveAccount({ visible: VISIBLE_FOR_ALL });
                visibleForTeam.current.checked = false;
              }
            }}
          />
          <LabeledCheckbox
            label="Visible for team only"
            defaultChecked={account.visible === VISIBLE_FOR_TEAM}
            ref={visibleForTeam}
            onChange={(event: any) => {
              if (event.target.checked) {
                saveAccount({ visible: VISIBLE_FOR_TEAM });
                visibleForAll.current.checked = false;
              }
            }}
          />
        </div>
      )}
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

export default function ChallengePage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const account = useAccount();
  useEffect(() => {
    const checkSize = () => {
      const { innerWidth } = window;
      setIsNarrow(innerWidth <= 768);
    };
    window.addEventListener('resize', checkSize);
    checkSize();

    return () => {
      window.removeEventListener('resize', checkSize);
    };
  }, []);
  useEffect(() => trackChallenge('dashboard-view'), []);

  return (
    <div className="challenge challenge-container">
      <WeeklyChallenge isNarrow={isNarrow} />
      <div className={`range-container ${showOverlay ? 'has-overlay' : ''}`}>
        {showOverlay && <Overlay hideOverlay={() => setShowOverlay(false)} />}
        <div className="leader-board">
          <LeaderBoardCard
            title={`${account.enrollment.team} Team Progress`}
            showVisibleIcon
            showOverlay={() => setShowOverlay(true)}
            service="team-progress"
          />
        </div>
        <div className="leader-board">
          <TeamBoardCard title="Overall Challenge Top Team" />
        </div>
        <div className="leader-board">
          <LeaderBoardCard
            title="Overall Challenge Top Contributors"
            showVisibleIcon
            showOverlay={() => setShowOverlay(true)}
            service="top-contributors"
          />
        </div>
      </div>
    </div>
  );
}
