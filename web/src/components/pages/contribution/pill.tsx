import * as React from 'react';

import './pill.css';

export type PillStatus = 'active' | 'done' | 'pending';

export default ({
  className = '',
  children,
  isOpen,
  num,
  onClick,
  openable = false,
  status,
  style,
}: {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  num: number;
  openable?: boolean;
  onClick: () => any;
  status: PillStatus;
  style?: any;
}) => (
  <div
    className={['pill', isOpen ? 'open' : '', status, className].join(' ')}
    onClick={
      openable
        ? event => {
            if (status === 'pending') return;
            event.stopPropagation();
            if (isOpen) return;
            onClick();
          }
        : null
    }
    style={style}>
    <div className="contents">{children}</div>
    <div className="num">{num}</div>
  </div>
);
