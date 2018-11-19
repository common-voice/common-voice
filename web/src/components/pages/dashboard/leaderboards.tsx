import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { CheckIcon, MicIcon } from '../../ui/icons';
import { Avatar } from '../../ui/ui';

import './leaderboard.css';

const FETCH_SIZE = 5;

interface PropsFromState {
  api: API;
}

const apiConnector = connect<PropsFromState>(({ api }: StateTree) => ({
  api,
}));

interface Props extends PropsFromState {
  locale: string;
}

const FetchRow = (props: React.HTMLProps<HTMLButtonElement>) => (
  <li className="more">
    <button {...props}>...</button>
  </li>
);

interface State {
  rows: { position: number; [key: string]: any }[];
}

export const RecordingsLeaderboard = apiConnector(
  class extends React.Component<Props, State> {
    state: State = {
      rows: [],
    };

    async componentDidMount() {
      const { api, locale } = this.props;
      this.setState({
        rows: await api.forLocale(locale).fetchClipsLeaderboard(),
      });
    }

    async fetchMore(cursor: [number, number]) {
      const { api, locale } = this.props;
      const newRows = await api.forLocale(locale).fetchClipsLeaderboard(cursor);
      this.setState(({ rows }) => {
        const allRows = [...newRows, ...rows];
        allRows.sort((r1, r2) => (r1.position > r2.position ? 1 : -1));
        return {
          rows: allRows,
        };
      });
    }

    render() {
      const { rows } = this.state;

      const items = rows.map((row, i) => {
        const prevPosition = i > 0 ? rows[i - 1].position : null;
        const nextPosition =
          i < rows.length - 1 ? rows[i + 1].position : Infinity;
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
          <li key={row.position} className="row">
            <div className="position">
              {row.position < 9 && '0'}
              {row.position + 1}
            </div>
            <div className="avatar-container">
              <Avatar url={row.avatar_url} />
            </div>
            <div className="username" title={row.username}>
              {row.username || '???'}
            </div>
            <div className="total">
              <MicIcon />
              {row.total}
            </div>
            <div className="valid">
              <CheckIcon />
              {row.valid}
            </div>
            <div className="rate">
              <div>{row.rate}</div> <div>{'%'}</div>
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

      return <ul className="leaderboard">{items}</ul>;
    }
  }
);
