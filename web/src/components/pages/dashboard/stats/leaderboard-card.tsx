import { Localized } from '@fluent/react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import API from '../../../../services/api';
import { trackDashboard } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
import StateTree from '../../../../stores/tree';
import {
  User,
  VISIBLE_FOR_NONE,
  VISIBLE_FOR_ALL,
} from '../../../../stores/user';
import URLS from '../../../../urls';
import { LocaleLink, LocalizedGetAttribute } from '../../../locale-helpers';

import {
  BookmarkIcon,
  CrossIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  MicIcon,
  OldPlayIcon,
  PlayOutlineIcon,
} from '../../../ui/icons';
import { Avatar, Toggle } from '../../../ui/ui';
import StatsCard from './stats-card';

import './leaderboard.css';

const FETCH_SIZE = 20;

function formatNumber(n: number) {
  return n > 1000 ? Math.floor(n / 1000) + 'k' : n;
}

interface PropsFromState {
  api: API;
  globalLocale: Locale.State;
}

interface Props extends PropsFromState {
  ref: { current: any };
  locale: string;
  type: 'clip' | 'vote';
}

const FetchRow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <li className="more">
    <button {...(props as any)}>
      <div>...</div>
    </button>
  </li>
);

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
    const { api, locale, type } = this.props;
    this.setState(
      {
        rows: await api.forLocale(locale).fetchLeaderboard(type),
      },
      this.scrollToUser
    );
  }

  async fetchMore(cursor: [number, number]) {
    const { api, globalLocale, locale, type } = this.props;
    trackDashboard('leaderboard-load-more', globalLocale);
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

    // TODO: Render <Fetchrow>s outside of `items` to flatten the list.
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
              <>
                {' ('}
                <Localized id="you">
                  <span />
                </Localized>
                )
              </>
            )}
          </div>
          <div className="total" title={row.total}>
            <OldPlayIcon className="play" />
            {formatNumber(row.total)}
          </div>
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
  ({ api, locale }: StateTree) => ({
    api,
    globalLocale: locale,
  }),
  null,
  null,
  { forwardRef: true }
)(UnconnectedLeaderboard);

export default function LeaderboardCard({
  currentLocale,
}: {
  currentLocale?: string;
}) {
  const account = useAccount();
  const saveAccount = useAction(User.actions.saveAccount);

  const [showInfo, setShowInfo] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const leaderboardRef = useRef(null);

  const isAccountVisible = account?.visible === VISIBLE_FOR_ALL;

  return (
    <StatsCard
      id="stats-leaderboard"
      {...{ currentLocale }}
      className={'leaderboard-card ' + (showOverlay ? 'has-overlay' : '')}
      title="top-contributors"
      iconButtons={
        <div className="icon-buttons">
          {/* {isAccountVisible && (
            <>
              <button
                type="button"
                onClick={() => {
                  leaderboardRef.current.scrollToUser();
                }}>
                <BookmarkIcon />{' '}
                <Localized id="show-ranking">
                  <span className="text" />
                </Localized>
              </button>

              <div className="icon-divider" />
            </>
          )} */}

          {/* <button type="button" onClick={() => setShowOverlay(true)}>
            {isAccountVisible ? <EyeIcon /> : <EyeOffIcon />}
            <Localized id="set-visibility">
              <span className="text" />
            </Localized>
          </button> */}

          {/* <div className="icon-divider" /> */}

          <div
            className="leaderboard-info"
            onMouseEnter={() => setShowInfo(true)}
            onMouseLeave={() => setShowInfo(false)}>
            {showInfo && (
              <div className="info-menu">
                <ul>
                  {[
                    { Icon: MicIcon, label: 'speak-goal-text' },
                    { Icon: PlayOutlineIcon, label: 'listen-goal-text' },
                  ].map(({ Icon, label }) => (
                    <li key={label}>
                      <div className="icon">
                        <Icon />
                      </div>{' '}
                      <Localized id={label}>
                        <span />
                      </Localized>
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
              defaultChecked={isAccountVisible}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const visible = event.target.checked
                  ? VISIBLE_FOR_ALL
                  : VISIBLE_FOR_NONE;
                saveAccount({ ...account, visible });
              }}
            />
            <Localized id="visibility-explainer" vars={{ minutes: 20 }}>
              <p className="explainer" />
            </Localized>
            <div className="info">
              <InfoIcon />
              <Localized
                id="visibility-overlay-note"
                elems={{
                  profileLink: <LocaleLink to={URLS.PROFILE_INFO} />,
                }}>
                <p className="note" />
              </Localized>
            </div>
          </div>
        )
      }
      tabs={{
        'recorded-clips': ({ locale }: { locale: string }) => (
          <Leaderboard
            key={'c' + locale}
            locale={locale}
            type="clip"
            ref={leaderboardRef}
          />
        ),
        'validated-clips': ({ locale }: { locale: string }) => (
          <Leaderboard
            key={'v' + locale}
            locale={locale}
            type="vote"
            ref={leaderboardRef}
          />
        ),
      }}
    />
  );
}
