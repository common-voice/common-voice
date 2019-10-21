import * as React from 'react';
import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import API from '../../../../services/api';
import { trackDashboard } from '../../../../services/tracker';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink, LocalizedGetAttribute } from '../../../locale-helpers';

import {
  BookmarkIcon,
  CheckIcon,
  CrossIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
} from '../../../ui/icons';
import { Avatar, Toggle } from '../../../ui/ui';
import StatsCard from '../stats/stats-card';
import { lazy } from 'react';
import './leaderboard.css';

const Lottie = lazy(() => import('react-lottie'));
const animationData = require('../../../layout/data.json');
const Percentage = () => <div className="percent">%</div>;
const FilledCheckIcon = () => (
  <div className="filled-check">
    <CheckIcon />
  </div>
);
const PointsIcon = () => <div className="star-points" />;
const FetchRow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <li className="more">
    <button {...(props as any)}>
      <div>...</div>
    </button>
  </li>
);
const RateColumn = (value: any) => (
  <div className="rate">
    <div className="exact">{value == null ? 'N/A' : value}</div>
    <div className="rounded">{value == null ? 'N/A' : Math.round(value)}</div>
    <div className="percent">{'%'}</div>
  </div>
);

const FETCH_SIZE = 5;
const locale = 'en';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {
  ref: { current: any };
  locale: string;
  type: 'clip' | 'vote';
}
interface State {
  rows: { position: number; [key: string]: any }[];
  isAtEnd: boolean;
}

class UnconnectedLeaderboard extends React.Component<Props, State> {
  state: State = {
    rows: [],
    isAtEnd: false,
  };
  scroller: { current: HTMLUListElement | null } = React.createRef();
  youRow: { current: HTMLLIElement | null } = React.createRef();

  async componentDidMount() {
    const { api, type } = this.props;
    this.setState(
      {
        rows: await api.forLocale(locale).fetchLeaderboard(type),
      },
      this.scrollToUser
    );
  }

  async fetchMore(cursor: [number, number]) {
    const { api, type } = this.props;
    trackDashboard('leaderboard-load-more', locale);
    const newRows = await api.forLocale(locale).fetchLeaderboard(type, cursor);
    this.setState(
      ({ rows }) => {
        const allRows = [
          ...newRows,
          ...rows.filter(
            r1 => !newRows.find((r2: any) => r1.clientHash == r2.clientHash)
          ),
        ];
        allRows.sort((r1, r2) => (r1.position > r2.position ? 1 : -1));
        return {
          rows: allRows,
          isAtEnd: newRows.length == 0,
        };
      },
      () => {
        this.updateScrollIndicator();
      }
    );
  }
  scrollToUser = () => {
    const row = this.youRow.current;
    if (!row) return;

    const scroller = this.scroller.current;
    scroller.scrollTop = row.offsetTop - scroller.offsetTop;
    this.updateScrollIndicator();
  };

  updateScrollIndicator = () => {
    const SIZE = 32;
    const el = this.scroller.current;
    el.style.setProperty(
      '--before-height',
      Math.min(el.scrollTop, SIZE) + 'px'
    );
    el.style.setProperty(
      '--after-height',
      Math.min(el.scrollHeight - el.scrollTop - el.clientHeight, SIZE) + 'px'
    );
  };

  render() {
    const { rows, isAtEnd } = this.state;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    const items = rows.map((row, i) => {
      const prevPosition = i > 0 ? rows[i - 1].position : null;
      const nextPosition =
        i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
      return [
        prevPosition && prevPosition + 1 < row.position ? (
          <FetchRow
            key={row.position + 'prev'}
            onClick={() =>
              this.fetchMore([
                Math.max(prevPosition + 1, row.position - FETCH_SIZE),
                row.position,
              ])
            }
          />
        ) : null,
        <li
          key={row.position}
          className={'row ' + (row.you ? 'you' : '')}
          ref={row.you ? this.youRow : null}>
          <div className="position">
            {row.position < 9 && '0'}
            {row.position + 1}
          </div>

          <div className="avatar-container">
            <Avatar url={row.avatar_url} />
          </div>

          <div className="username" title={row.username}>
            {row.username || '???'}
            {row.you && (
              <React.Fragment>
                {' ('}
                <span>You</span>)
              </React.Fragment>
            )}
          </div>
          <div className="total" title={row.total}>
            {row.total}
          </div>
          <div className="valid" title={row.valid}>
            <CheckIcon />
            {row.valid}
          </div>
          <RateColumn value={row.rate} />
        </li>,
        nextPosition &&
        nextPosition - 1 > row.position &&
        nextPosition - FETCH_SIZE > row.position ? (
          <FetchRow
            key={row.position + 'next'}
            onClick={() =>
              this.fetchMore([
                row.position + 1,
                Math.min(row.position + 1 + FETCH_SIZE, nextPosition - 1),
              ])
            }
          />
        ) : null,
      ];
    });

    return (
      <ul
        className="leaderboard"
        ref={this.scroller}
        onScroll={this.updateScrollIndicator}>
        {items}
      </ul>
    );
  }
}

const Leaderboard = connect<PropsFromState>(
  ({ api }: StateTree) => ({
    api,
  }),
  null,
  null,
  { forwardRef: true }
)(UnconnectedLeaderboard);

export default function LeaderboardCard({ title }: { title: string }) {
  const account = useAccount();
  const saveAccount = useAction(User.actions.saveAccount);

  const [showInfo, setShowInfo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const leaderboardRef = useRef(null);

  const minutes = 20;

  return (
    <StatsCard
      key="leaderboard"
      className={'leaderboard-card ' + (showOverlay ? 'has-overlay' : '')}
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

          <button type="button" onClick={() => setShowOverlay(true)}>
            {account.visible ? <EyeIcon /> : <EyeOffIcon />}
            <span className="text">Set my visibility</span>
          </button>

          <div className="icon-divider" />

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
      overlay={
        showOverlay && (
          <div className="leaderboard-overlay">
            <button
              className="close-overlay"
              type="button"
              onClick={() => setShowOverlay(false)}>
              <CrossIcon />
            </button>
            <LocalizedGetAttribute
              id="leaderboard-visibility"
              attribute="label">
              {label => <h2>{label}</h2>}
            </LocalizedGetAttribute>
            <Toggle
              offText="hidden"
              onText="visible"
              defaultChecked={Boolean(account.visible)}
              onChange={(event: any) => {
                saveAccount({ visible: event.target.checked });
              }}
            />
            <p className="explainer">
              This setting controls your leaderboard visibility. When hidden,
              your progress will be private. This means your image, user name
              and progress will not appear on the leaderboard. Note that
              leaderboard refresh takes ~{minutes}min to populate changes.
            </p>
            <div className="info">
              <InfoIcon />
              <p className="note">
                Note: When set to 'Visible', this setting can be changed from
                the <LocaleLink to={URLS.PROFILE_INFO}>Profile page</LocaleLink>
              </p>
            </div>
          </div>
        )
      }
      tabs={{
        recorded: () => (
          <Leaderboard
            key="recorded"
            type="clip"
            locale={locale}
            ref={leaderboardRef}
          />
        ),
        validated: () => (
          <Leaderboard
            key="validated"
            type="vote"
            locale={locale}
            ref={leaderboardRef}
          />
        ),
      }}
    />
  );
}
