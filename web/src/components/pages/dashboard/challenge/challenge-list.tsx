// Largely copied from `leaderboard-card.tsx`.
// TODO: Refactor to reduce duplication with the LeaderboardCard component.
import * as React from 'react';
import API from '../../../../services/api';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { Avatar } from '../../../ui/ui';
import TeamAvatar from './team-avatar';
import { CheckIcon } from '../../../ui/icons';
import { connect } from 'react-redux';
import { challengeTeams } from 'common';

const PointsIcon = ({ className }: { className: string }) => (
  <div className={`star-points ${className}`} />
);
const FetchRow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <li className="more">
    <button {...(props as any)}>
      <div>...</div>
    </button>
  </li>
);

const FETCH_SIZE = 5;
const locale = 'ar';

interface PropsFromState {
  api: API;
  user: User.State;
}

interface Props extends PropsFromState {
  ref: { current: any };
  service: string;
  team?: boolean;
  type?: 'clip' | 'vote';
  week?: number;
  challengeComplete?: boolean;
}

interface State {
  rows: { position: number; [key: string]: any }[];
  isAtEnd: boolean;
}

class ChallengeList extends React.Component<Props, State> {
  state: State = {
    rows: [],
    isAtEnd: false,
  };
  scroller: { current: HTMLUListElement | null } = React.createRef();
  youRow: { current: HTMLLIElement | null } = React.createRef();

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

  callService = (cursor?: [number, number]) => {
    const { service, api, type } = this.props;
    switch (service) {
      case 'team-progress':
        api.fetchTopMembers(locale, type, cursor).then(member => {
          this.setState(
            ({ rows }) => {
              const allRows = [...rows, ...member];
              return {
                rows: allRows,
                isAtEnd: member.length == 0,
              };
            },
            () => {
              this.updateScrollIndicator();
            }
          );
        });
        break;
      case 'top-teams':
        api.fetchTopTeams(locale, cursor).then(data => {
          this.setState(
            ({ rows }) => {
              const allRows = [...rows, ...data];
              return {
                rows: allRows,
                isAtEnd: data.length == 0,
              };
            },
            () => {
              this.updateScrollIndicator();
            }
          );
        });
        break;
      case 'top-contributors':
        api.fetchTopContributors(locale, type, cursor).then(data => {
          this.setState(
            ({ rows }) => {
              const allRows = [...rows, ...data];
              return {
                rows: allRows,
                isAtEnd: data.length == 0,
              };
            },
            () => {
              this.updateScrollIndicator();
            }
          );
        });

        break;
    }
  };
  componentDidMount() {
    this.callService();
  }

  fetchMore = (cursor: [number, number]) => {
    this.callService(cursor);
  };

  scrollToUser = () => {
    const row = this.youRow.current;
    if (!row) return;

    this.scroller.current.scrollTop =
      row.offsetTop - this.scroller.current.offsetTop;
    this.updateScrollIndicator();
  };

  transformRankingToString = (ranking: number) => {
    switch (ranking) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return String(ranking) + 'th';
    }
  };

  render() {
    const { rows, isAtEnd } = this.state;
    const { user, team, week, challengeComplete } = this.props;
    // TODO: Render <Fetchrow>s outside of `items` to flatten the list.

    const items = rows.map((row, i) => {
      const prevPosition = i > 0 ? rows[i - 1].position : null;
      const nextPosition =
        i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
      const isYou =
        row.name ===
        (team ? user.account.enrollment.team : user.account.username);
      return [
        !!prevPosition && prevPosition + 1 < row.position && (
          <FetchRow
            key={row.position + 'prev'}
            onClick={() =>
              this.fetchMore([
                Math.max(prevPosition + 1, row.position - FETCH_SIZE),
                row.position,
              ])
            }
          />
        ),
        team ? (
          <li
            key={row.position}
            className={`row team${isYou ? ' you' : ''}`}
            ref={isYou ? this.youRow : null}>
            <div className="ranking">
              <div className="position">
                {row.position + 1 < 10 && '0'}
                {row.position + 1}
              </div>
              <div className="avatar-container">
                <TeamAvatar team={row.name.toLowerCase()} />
              </div>
              <div className="username" title={row.name}>
                {row.name || '???'}
              </div>
            </div>
            <div className="week" title="Week">
              {row.w1_points && week > 0 ? (
                <>
                  <PointsIcon
                    className={row.w1 <= 3 ? `star-points-${row.w1}` : ''}
                  />
                  {this.transformRankingToString(row.w1)}
                </>
              ) : (
                '--'
              )}
            </div>
            <div className="week" title="Week">
              {row.w2_points && week > 1 ? (
                <>
                  <PointsIcon
                    className={row.w2 <= 3 ? `star-points-${row.w2}` : ''}
                  />
                  {this.transformRankingToString(row.w2)}
                </>
              ) : (
                '--'
              )}
            </div>
            <div className="week" title="Week">
              {row.w3_points && (week > 2 || challengeComplete) ? (
                <>
                  <PointsIcon
                    className={row.w3 <= 3 ? `star-points-${row.w3}` : ''}
                  />
                  {this.transformRankingToString(row.w3)}
                </>
              ) : (
                '--'
              )}
            </div>
            <div className="total">{row.w3_points || 'N/A'}</div>
          </li>
        ) : (
          <li
            key={row.position}
            className={`row${isYou ? ' you' : ''}`}
            ref={isYou ? this.youRow : null}>
            <div className="ranking">
              <div className="position">
                {row.position + 1 < 10 && '0'}
                {row.position + 1}
              </div>
              <div className="avatar-container">
                <Avatar url={row.avatar_url} />
              </div>
              <div className="username" title={row.name}>
                {row.name || '???'}
              </div>
            </div>
            <div className="point" title={row.points}>
              <PointsIcon
                className={
                  row.position < 3 ? `star-points-${row.position + 1}` : ''
                }
              />
              {row.points}
            </div>
            <div className="approved" title={row.approved}>
              <CheckIcon />
              {row.approved}
            </div>
            <div className="accuracy">{row.accuracy || 'N/A'} %</div>
          </li>
        ),
        !!nextPosition &&
          nextPosition - 1 > row.position &&
          nextPosition - FETCH_SIZE > row.position && (
            <FetchRow
              key={row.position + 'next'}
              onClick={() =>
                this.fetchMore([
                  row.position + 1,
                  Math.min(row.position + 1 + FETCH_SIZE, nextPosition - 1),
                ])
              }
            />
          ),
      ];
    });
    // [TODO]: This should be a <table>.
    return (
      <ul
        className="leaderboard"
        ref={this.scroller}
        onScroll={this.updateScrollIndicator}>
        <li className="header" key="header">
          {team ? (
            <>
              <span className="ranking">Ranking & Name</span>
              <span className="week">W1</span>
              <span className="week">W2</span>
              <span className="week">W3</span>
              <span className="total">Total Points</span>
            </>
          ) : (
            <>
              <span className="ranking">Ranking & Name</span>
              <span className="point">Points</span>
              <span className="approved">Approved</span>
              <span className="accuracy">Accuracy</span>
            </>
          )}
        </li>
        {items}
      </ul>
    );
  }
}
export default connect<PropsFromState>(
  ({ api, user }: StateTree) => ({
    api,
    user,
  }),
  null,
  null,
  { forwardRef: true }
)(ChallengeList);
