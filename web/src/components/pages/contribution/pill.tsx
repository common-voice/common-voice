import * as React from 'react';

import './pill.css';

export type PillStatus = 'active' | 'done' | 'pending';

export default ({
  className = '',
  children,
  isOpen,
  num,
  status,
}: {
  className?: string;
  children: React.ReactNode;
  isOpen: boolean;
  num: number;
  status: PillStatus;
}) => (
  <div
    className={['pill', isOpen ? 'open' : 'closed', status, className].join(
      ' '
    )}>
    <div className="contents">{children}</div>
    <div className="num">{num}</div>
  </div>
);
