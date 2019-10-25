import * as React from 'react';
import API from '../../../../services/api';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { Avatar } from '../../../ui/ui';
import { CheckIcon } from '../../../ui/icons';
import { connect } from 'react-redux';

const PointsIcon = () => <div className="star-points" />;
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
  type: 'recorded' | 'validated';
  showTeamInfo: boolean;
}

interface State {
  rows: { position: number; [key: string]: any }[];
  team: { [key: string]: any };
  isAtEnd: boolean;
}

class ChallengeList extends React.Component<Props, State> {
  state: State = {
    rows: [],
    team: {},
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
    const { service, api, type, user } = this.props;
    const { email, challenge_team } = user.account;
    switch (service) {
      case 'team-progress':
        api
          .fetchTeamProgress(locale, type, cursor, email, challenge_team)
          .then(({ team, member }) => {
            this.setState({ team: team });
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
        api.fetchTopTeams(locale, type, cursor).then(data => {
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

  render() {
    const { rows, isAtEnd, team } = this.state;
    const { user, showTeamInfo } = this.props;
    const items = rows.map((row, i) => {
      const prevPosition = i > 0 ? rows[i - 1].position : null;
      const nextPosition =
        i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
      const isYou =
        row.name === user.account.username ||
        row.name === user.account.challenge_team;
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
            <PointsIcon />
            {row.points}
          </div>
          <div className="approved" title={row.approved}>
            <CheckIcon />
            {row.approved}
          </div>
          <div className="accuracy">{row.accuracy} %</div>
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
        <li className="header" key="header">
          <span className="ranking">Ranking & Name</span>
          <span className="point">Points</span>
          <span className="approved">Approved</span>
          <span className="accuracy">Accuracy</span>
        </li>
        {showTeamInfo && team && (
          <li className="row" key="team">
            <div className="ranking">
              <div className="position"></div>
              <div className="avatar-container">
                <Avatar
                  className="team"
                  url={
                    team.name
                      ? require(`./images/${team.name.toLowerCase()}.svg`)
                      : ''
                  }
                />
              </div>
              <div className="username" title={team.name}>
                {team.name || '???'}
              </div>
            </div>
            <div className="point" title={team.points}>
              <PointsIcon />
              {team.points}
            </div>
            <div className="approved" title={team.approved}>
              <CheckIcon />
              {team.approved}
            </div>
            <div className="accuracy">{team.accuracy} %</div>
          </li>
        )}
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
