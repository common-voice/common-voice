import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAccount, useAPI } from '../../../../hooks/store-hooks';
import { Avatar } from '../../../ui/ui';
import { CheckIcon } from '../../../ui/icons';

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

export default function ChallengeList({
  type,
  service,
  forwardedRef,
}: {
  type: 'recorded' | 'validated';
  service: string;
  forwardedRef: React.Ref<unknown>;
}) {
  const [rows, setRows] = useState([]);
  const [isAtEnd, setAtEnd] = useState(false);
  const account = useAccount();
  const scroller = useRef(null);
  forwardedRef = scroller;
  const youRow = useRef(null);
  const api = useAPI();

  const items = rows.map((row, i) => {
    const prevPosition = i > 0 ? rows[i - 1].position : null;
    const nextPosition =
      i < rows.length - 1 ? rows[i + 1].position : isAtEnd ? 0 : Infinity;
    const isYou =
      row.name === account.username || row.name === account.challenge_team;
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
        ref={isYou ? youRow : null}>
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
            fetchMore([
              row.position + 1,
              Math.min(row.position + 1 + FETCH_SIZE, nextPosition - 1),
            ])
          }
        />
      ) : null,
    ];
  });

  const updateScrollIndicator = () => {
    const SIZE = 32;
    const el = scroller.current;
    el.style.setProperty(
      '--before-height',
      Math.min(el.scrollTop, SIZE) + 'px'
    );
    el.style.setProperty(
      '--after-height',
      Math.min(el.scrollHeight - el.scrollTop - el.clientHeight, SIZE) + 'px'
    );
  };
  const callService = (cursor?: [number, number]) => {
    switch (service) {
      case 'team-progress':
        break;
      case 'top-teams':
        const newRows = api.fetchTopTeams(locale, type, cursor);
        setRows(rows => [...rows, ...newRows]);
        setAtEnd(newRows.length == 0);
        break;
      case 'top-contributors':
        break;
    }
  };
  const fetchMore = (cursor: [number, number]) => {
    callService(cursor);
  };
  const scrollToUser = () => {
    const row = youRow.current;
    if (!row) return;

    scroller.current.scrollTop = row.offsetTop - scroller.current.offsetTop;
    this.updateScrollIndicator();
  };
  useEffect(() => {
    callService();
  }, []);
  return (
    <ul className="leaderboard" ref={scroller} onScroll={updateScrollIndicator}>
      <li className="header" key="header">
        <span>Ranking & Name</span>
        <span>Points</span>
        <span>Approved</span>
        <span>Accuracy</span>
      </li>
      {items}
    </ul>
  );
}
