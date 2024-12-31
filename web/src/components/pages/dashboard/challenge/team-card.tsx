import * as React from 'react';
import { useRef, useState } from 'react';
import { useAccount } from '../../../../hooks/store-hooks';

import {
  BookmarkIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
} from '../../../ui/icons';

import ChallengeList from './challenge-list';

const Percentage = () => <div className="percent">%</div>;
const FilledCheckIcon = () => (
  <div className="filled-check">
    <CheckIcon />
  </div>
);
const PointsIcon = () => <div className="star-points" />;

export default function TeamboardCard({
  title,
  showVisibleIcon,
  showOverlay,
  week,
  challengeComplete,
}: {
  title: string;
  showVisibleIcon?: boolean;
  showOverlay?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  week?: number;
  challengeComplete?: boolean;
}) {
  const account = useAccount();

  const [showInfo, setShowInfo] = useState(false);

  const teamboardRef = useRef(null);
  return (
    <div className="stats-card leaderboard-card">
      <div className="stats-card__inner">
        <div className="title-and-icon">
          <h2 className="challenge-title">{title}</h2>
          <div className="icon-buttons">
            {Boolean(account.visible) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    teamboardRef.current.scrollToUser();
                  }}>
                  <BookmarkIcon /> <span className="text">Show my ranking</span>
                </button>

                <div className="icon-divider" />
              </>
            )}
            {showVisibleIcon && (
              <>
                <button type="button" onClick={showOverlay}>
                  {account.visible ? <EyeIcon /> : <EyeOffIcon />}
                  <span className="text">Set my visibility</span>
                </button>
                <div className="icon-divider" />
              </>
            )}
            <div
              className="leaderboard-info"
              onMouseEnter={() => setShowInfo(true)}
              onMouseLeave={() => setShowInfo(false)}>
              {showInfo && (
                <div className="info-menu">
                  <ul>
                    {[
                      { Icon: PointsIcon, label: 'Points' },
                      { Icon: FilledCheckIcon, label: 'Total Approved' },
                      { Icon: Percentage, label: 'Overall Accuracy' },
                    ].map(({ Icon, label }) => (
                      <li key={label}>
                        <div className="info-icon">
                          <Icon />
                        </div>{' '}
                        <span>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ height: 10 }}>
                    <div className="triangle" />
                  </div>
                </div>
              )}
              <button
                className={showInfo ? 'active' : ''}
                style={{ display: 'flex' }}
                onClick={() => setShowInfo(!showInfo)}
                type="button">
                <InfoIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="filters" style={{ justifyContent: 'flex-end' }}>
          <span className="english-only">English Only</span>
        </div>
        <div className="content">
          <ChallengeList
            key="team-list"
            service="top-teams"
            ref={teamboardRef}
            team
            challengeComplete={challengeComplete}
            week={week}
          />
        </div>
      </div>
    </div>
  );
}
