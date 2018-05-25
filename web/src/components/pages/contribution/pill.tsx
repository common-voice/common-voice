import * as React from 'react';

import './pill.css';

export type PillStatus = 'active' | 'done' | 'pending';

export default ({
  className = '',
  children,
  isOpen,
  num,
  onClick,
  status,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  num: number;
  onClick: () => any;
  status: PillStatus;
  style?: any;
}) => (
  <div
    className={['pill', isOpen ? 'open' : '', status, className].join(' ')}
    onClick={event => {
      if (status !== 'done') return;
      event.stopPropagation();
      if (isOpen) return;
      onClick();
    }}
    style={style}>
    <div className="contents">{children}</div>
    <div className="num">{num}</div>
  </div>
);
