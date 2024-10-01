import * as React from 'react';
import './pill.css';

export type PillStatus = 'active' | 'done' | 'pending';

const getStyles = (children: React.ReactNode, status: PillStatus, customStyle?: React.CSSProperties) => ({
  backgroundColor: !children && status === 'done'  ? '#ECFDF3' : '#ffffff',
  border: !children && status === 'done' ? '1px solid #ABEFC6' : '1px solid #D2D6DB',
  borderRadius: '8px',
  color: !children && status === 'done' ? '#085D3A' : '#9DA4AE',
  height: '44px',
  padding: '8px',
  ...customStyle,
});

const Pill = ({
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
  onClick: () => void;
  status: PillStatus;
  style?: React.CSSProperties;
}) => (
  <div
    className={['pill', isOpen ? 'open' : '', status, className].join(' ')}
    onClick={
      openable && 
      status !== 'pending' ? (event) => {
      event.stopPropagation();
      if (!isOpen) onClick();
    } : null}
    style={getStyles(children, status, style)}
  >
    <div className="contents">{children}</div>
    <div className="num">
      {status === 'done' && <img src="/img/check-mark.svg" alt="check-mark" width={26} height={26} />}
      {status === 'pending' && <img src="/img/check-mark-muted.svg" alt="check-mark-muted" width={26} height={26} />}
      {status === 'active' && <span>{num}</span>}
    </div>
  </div>
);

export default Pill;
