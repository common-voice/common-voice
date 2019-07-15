import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import { trackDashboard } from '../../../../services/tracker';
import { Locale } from '../../../../stores/locale';
import StateTree from '../../../../stores/tree';
import {
  CheckIcon,
  InfoIcon,
  MicIcon,
  OldPlayIcon,
  PlayOutlineIcon,
  PlayIcon,
} from '../../../ui/icons';
import { Avatar } from '../../../ui/ui';
import StatsCard from './stats-card';
import { isProduction } from '../../../../utility';

import './leaderboard.css';

const FETCH_SIZE = 5;

interface PropsFromState {
  api: API;
  globalLocale: Locale.State;
}

interface Props extends LocalizationProps, PropsFromState {
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
  playingClipIndex: number;
}

class UnconnectedLeaderboard extends React.Component<Props, State> {
  state: State = {
    rows: [],
    isAtEnd: false,
    playingClipIndex: null,
  };

  scroller: { current: HTMLUListElement | null } = React.createRef();
  youRow: { current: HTMLLIElement | null } = React.createRef();

  async componentDidMount() {
    const { api, locale, type } = this.props;
    this.setState(
      {
        rows: await api.forLocale(locale).fetchLeaderboard(type),
      },
      () => {
        const row = this.youRow.current;
        if (!row) return;

        this.scroller.current.scrollTop = row.getBoundingClientRect().top;
      }
    );
  }

  async fetchMore(cursor: [number, number]) {
    const { api, globalLocale, locale, type } = this.props;
    trackDashboard('leaderboard-load-more', globalLocale);
    const newRows = await api.forLocale(locale).fetchLeaderboard(type, cursor);
    this.setState(({ rows }) => {
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
    });
  }
  playAvatarClip = function(clipUrl: string, position: any) {
    if (this.state.playingClipIndex === null) {
      this.setState({ playingClipIndex: position });

      const audio = new Audio(clipUrl);
      audio.play();

      audio.onended = () => {
        this.setState({ playingClipIndex: null });
      };

      audio.onerror = () => {
        this.setState({ playingClipIndex: null });
      };
    }
  };

  render() {
    const { getString } = this.props;
    const { rows, isAtEnd, playingClipIndex } = this.state;

    const items = rows.map((row, i) => {
      const prevPosition = i > 0 ? rows[i - 1].position : null;
      const nextPosition =
        i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
      const hasRate = row.rate != null;
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

          {isProduction() && row.avatar_url !== null ? (
            <div className="avatar-container">
              <Avatar url={row.avatar_url} />
            </div>
          ) : (
            <button
              className="avatar-container"
              title="Click to play avatar"
              onClick={() =>
                this.playAvatarClip(row.avatarClipUrl, row.position)
              }>
              <div
                className={playingClipIndex === row.position ? 'rotate' : ''}>
                <Avatar url={row.avatar_url} />
              </div>
              {playingClipIndex === row.position && <PlayIcon />}
            </button>
          )}

          <div className="username" title={row.username}>
            {row.username || '???'}
            {row.you && (
              <React.Fragment>
                {' ('}
                <Localized id="you">
                  <span />
                </Localized>
                )
              </React.Fragment>
            )}
          </div>
          <div className="total">
            {this.props.type == 'clip' ? (
              <MicIcon />
            ) : (
              <OldPlayIcon className="play" />
            )}
            {row.total}
          </div>
          <div className="valid">
            <CheckIcon />
            {row.valid}
          </div>
          <div className="rate">
            <div className="exact">
              {hasRate ? row.rate : getString('not-available-abbreviation')}
            </div>
            <div className="rounded">
              {hasRate
                ? Math.round(row.rate)
                : getString('not-available-abbreviation')}
            </div>
            <div className="percent">{'%'}</div>
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
      <ul className="leaderboard" ref={this.scroller}>
        {items}
      </ul>
    );
  }
}
const Leaderboard = connect<PropsFromState>(({ api, locale }: StateTree) => ({
  api,
  globalLocale: locale,
}))(withLocalization(UnconnectedLeaderboard));

const FilledCheckIcon = () => (
  <div className="filled-check">
    <CheckIcon />
  </div>
);

const Percentage = () => <div className="percent">%</div>;

export default class extends React.Component<{}, { showInfo: boolean }> {
  state = { showInfo: false };

  hideInfo = () => this.setState({ showInfo: false });
  showInfo = () => this.setState({ showInfo: true });

  render() {
    const { showInfo } = this.state;
    return (
      <StatsCard
        key="leaderboard"
        title="top-contributors"
        iconButtons={
          <div
            className="leaderboard-info"
            onMouseEnter={this.showInfo}
            onMouseLeave={this.hideInfo}>
            {showInfo && (
              <div className="info-menu">
                <ul>
                  {[
                    { Icon: MicIcon, label: 'speak-goal-text' },
                    { Icon: PlayOutlineIcon, label: 'listen-goal-text' },
                    { Icon: FilledCheckIcon, label: 'total-approved' },
                    { Icon: Percentage, label: 'overall-accuracy' },
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
              onClick={() => this.setState({ showInfo: !showInfo })}>
              <InfoIcon />
            </button>
          </div>
        }
        tabs={{
          'recorded-clips': ({ locale }) => (
            <Leaderboard key={'c' + locale} locale={locale} type="clip" />
          ),
          'validated-clips': ({ locale }) => (
            <Leaderboard key={'v' + locale} locale={locale} type="vote" />
          ),
        }}
      />
    );
  }
}
