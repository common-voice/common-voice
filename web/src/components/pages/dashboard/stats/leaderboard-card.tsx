import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useAccount, useAction } from '../../../../hooks/store-hooks';
import API from '../../../../services/api';
import { trackDashboard, trackVoiceAvatar } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
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
  MicIcon,
  OldPlayIcon,
  PlayIcon,
  PlayOutlineIcon,
} from '../../../ui/icons';
import { Avatar, Toggle } from '../../../ui/ui';
import StatsCard from './stats-card';
import { isProduction } from '../../../../utility';
import { Suspense, lazy } from 'react';
const Lottie = lazy(() => import('react-lottie'));
const animationData = require('../../../layout/data.json');

import './leaderboard.css';

const FETCH_SIZE = 5;

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

const RateColumn = withLocalization(
  ({ getString, value }: { value: number } & WithLocalizationProps) => (
    <div className="rate">
      <div className="exact">
        {value == null ? getString('not-available-abbreviation') : value}
      </div>
      <div className="rounded">
        {value == null
          ? getString('not-available-abbreviation')
          : Math.round(value)}
      </div>
      <div className="percent">{'%'}</div>
    </div>
  )
);

interface State {
  rows: { position: number; [key: string]: any }[];
  isAtEnd: boolean;
  playingClipIndex: number;
}

class UnconnectedLeaderboard extends React.Component<Props, State> {
  state: State = {
    rows: [],
    isAtEnd: false,
    playingClipIndex: null,
  };
  audioRef = React.createRef<HTMLAudioElement>();

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

  playAvatarClip = function (clipUrl: string, position: any, self: boolean) {
    const { locale } = this.props;
    trackVoiceAvatar(self ? 'self-listen' : 'listen', locale);

    if (this.state.playingClipIndex === null) {
      this.setState({ playingClipIndex: position });

      this.audioRef.current.src = clipUrl;

      this.audioRef.current.play();
    } else {
      this.audioRef.current.pause();
      this.audioRef.current.currentTime = 0;
      this.setState({ playingClipIndex: null });
    }
  };

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
    const { rows, isAtEnd, playingClipIndex } = this.state;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

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

          {!isProduction() ? (
            row.avatarClipUrl === null ? (
              <div className="avatar-container">
                <Avatar url={row.avatar_url} />
              </div>
            ) : (
              <div>
                <audio
                  preload="auto"
                  ref={this.audioRef}
                  onEnded={() => this.setState({ playingClipIndex: null })}
                  onError={() => this.setState({ playingClipIndex: null })}
                />
                <button
                  className="avatar-container"
                  onMouseEnter={() =>
                    this.playAvatarClip(
                      row.avatarClipUrl,
                      row.position,
                      row.you
                    )
                  }
                  onMouseLeave={() =>
                    this.playAvatarClip(
                      row.avatarClipUrl,
                      row.position,
                      row.you
                    )
                  }
                  onClick={() =>
                    this.playAvatarClip(
                      row.avatarClipUrl,
                      row.position,
                      row.you
                    )
                  }>
                  <div>
                    <Avatar url={row.avatar_url} />
                  </div>
                </button>
              </div>
            )
          ) : (
            <div className="avatar-container">
              <Avatar url={row.avatar_url} />
            </div>
          )}

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
          {playingClipIndex === row.position && (
            <div className="lottie">
              <Suspense fallback={<div />}>
                <div className="animation">
                  <Lottie
                    options={defaultOptions}
                    eventListeners={[]}
                    height={80}
                    width={250}
                  />
                </div>
              </Suspense>{' '}
            </div>
          )}
          <div className="total" title={row.total}>
            {this.props.type == 'clip' ? (
              <MicIcon />
            ) : (
              <OldPlayIcon className="play" />
            )}
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

const FilledCheckIcon = () => (
  <div className="filled-check">
    <CheckIcon />
  </div>
);

const Percentage = () => <div className="percent">%</div>;

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

  return (
    <StatsCard
      key="leaderboard"
      {...{ currentLocale }}
      className={'leaderboard-card ' + (showOverlay ? 'has-overlay' : '')}
      title="top-contributors"
      iconButtons={
        <div className="icon-buttons">
          {Boolean(account?.visible) && (
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
          )}

          <button type="button" onClick={() => setShowOverlay(true)}>
            {account?.visible ? <EyeIcon /> : <EyeOffIcon />}
            <Localized id="set-visibility">
              <span className="text" />
            </Localized>
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
              defaultChecked={Boolean(account.visible)}
              onChange={(event: any) => {
                saveAccount({ visible: event.target.checked });
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
        'recorded-clips': ({ locale }) => (
          <Leaderboard
            key={'c' + locale}
            locale={locale}
            type="clip"
            ref={leaderboardRef}
          />
        ),
        'validated-clips': ({ locale }) => (
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
