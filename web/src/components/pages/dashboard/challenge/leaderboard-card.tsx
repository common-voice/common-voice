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

import StatsCard from '../stats/stats-card';
import ChallengeList from './challenge-list';

const Percentage = () => <div className="percent">%</div>;
const FilledCheckIcon = () => (
  <div className="filled-check">
    <CheckIcon />
  </div>
);
const PointsIcon = () => <div className="star-points" />;

const locale = 'en';

export default function LeaderboardCard({
  title,
  showVisibleIcon,
  showOverlay,
  service,
}: {
  title: string;
  showVisibleIcon?: boolean;
  showOverlay?: (event: React.MouseEvent<HTMLInputElement>) => void;
  service: 'top-teams' | 'team-progress' | 'top-contributors';
}) {
  const account = useAccount();

  const [showInfo, setShowInfo] = useState(false);

  const leaderboardRef = useRef(null);
  return (
    <StatsCard
      key="leaderboard"
      className="leaderboard-card"
      title={title}
      challenge={true}
      iconButtons={
        <div className="icon-buttons">
          {Boolean(account.visible) && (
            <>
              <button
                type="button"
                onClick={() => {
                  leaderboardRef.current.scrollToUser();
                }}>
                <BookmarkIcon /> <span className="text">Show my ranking</span>
              </button>

              <div className="icon-divider" />
            </>
          )}
          {showVisibleIcon && (
            <React.Fragment>
              <button type="button" onClick={showOverlay}>
                {account.visible ? <EyeIcon /> : <EyeOffIcon />}
                <span className="text">Set my visibility</span>
              </button>
              <div className="icon-divider" />
            </React.Fragment>
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
      }
      tabs={{
        recorded: () =>
          React.forwardRef((props, ref) => {
            return (
              <ChallengeList
                type="recorded"
                service={service}
                forwardedRef={ref}
              />
            );
          }),
        validated: () =>
          React.forwardRef((props, ref) => {
            return (
              <ChallengeList
                type="validated"
                service={service}
                forwardedRef={ref}
              />
            );
          }),
      }}
    />
  );
}
