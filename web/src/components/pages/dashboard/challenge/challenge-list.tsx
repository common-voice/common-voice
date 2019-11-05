import * as React from 'react';
import API from '../../../../services/api';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { Avatar } from '../../../ui/ui';
import { CheckIcon } from '../../../ui/icons';
import { connect } from 'react-redux';
import { challengeLogoUrls } from './constants';

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
const locale = 'en';

interface PropsFromState {
  api: API;
  user: User.State;
}

interface Props extends PropsFromState {
  ref: { current: any };
  service: string;
  team?: boolean;
  type?: 'recorded' | 'validated';
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
        api.fetchTeamProgress(locale, type, cursor).then(({ member }) => {
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
    const { user, team } = this.props;
    const items = rows.map((row, i) => {
      const prevPosition = i > 0 ? rows[i - 1].position : null;
      const nextPosition =
        i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
      const isYou =
        row.name === user.account.username ||
        row.name === user.account.enrollment.team;
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
        !team ? (
          <li
            key={row.position}
            className={'row ' + (isYou ? 'you' : '')}
            ref={isYou ? this.youRow : null}>
            <div className="ranking">
              <div className="position">
                {row.position < 10 && '0'}
                {row.position}
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
                  row.position <= 3 ? `star-points-${row.position}` : ''
                }
              />
              {row.points}
            </div>
            <div className="approved" title={row.approved}>
              <CheckIcon />
              {row.approved}
            </div>
            <div className="accuracy">{row.accuracy} %</div>
          </li>
        ) : (
          <li
            key={row.position}
            className={'row team' + (isYou ? 'you' : '')}
            ref={isYou ? this.youRow : null}>
            <div className="ranking">
              <div className="position">
                {row.position < 10 && '0'}
                {row.position}
              </div>
              <div className="avatar-container">
                <Avatar url={challengeLogoUrls[user.account.enrollment.team]} />
              </div>
              <div className="username" title={row.name}>
                {row.name || '???'}
              </div>
            </div>
            <div className="week" title="Week">
              {row.w1 && !row.w2 && !row.w3 && (
                <PointsIcon
                  className={
                    row.position <= 3 ? `star-points-${row.position}` : ''
                  }
                />
              )}
              {this.transformRankingToString(row.w1)}
            </div>
            <div className="week" title="Week">
              {row.w1 && row.w2 && !row.w3 && (
                <PointsIcon
                  className={
                    row.position <= 3 ? `star-points-${row.position}` : ''
                  }
                />
              )}
              {row.w2 ? this.transformRankingToString(row.w2) : '--'}
            </div>
            <div className="week" title="Week">
              {row.w1 && row.w2 && row.w3 && (
                <PointsIcon
                  className={
                    row.position <= 3 ? `star-points-${row.position}` : ''
                  }
                />
              )}
              {row.w3 ? this.transformRankingToString(row.w2) : '--'}
            </div>
            <div className="total">{row.total}</div>
          </li>
        ),
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
        <li className="header" key="header">
          {team ? (
            <React.Fragment>
              <span className="ranking">Ranking & Name</span>
              <span className="week">W1</span>
              <span className="week">W2</span>
              <span className="week">W3</span>
              <span className="total">Total Points</span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span className="ranking">Ranking & Name</span>
              <span className="point">Points</span>
              <span className="approved">Approved</span>
              <span className="accuracy">Accuracy</span>
            </React.Fragment>
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
