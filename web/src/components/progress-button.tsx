import * as React from 'react';
import { Button } from './ui/ui';

interface Props {
  children?: any;
  disabled: boolean;
  percent: number;
  onClick?(): void;
}

export default ({ disabled, percent, children, onClick }: Props) => (
  <Button className="progress-button" onClick={onClick} disabled={disabled}>
    <span
      className="progress"
      style={{ transform: `translateX(${percent - 100}%)` }}
    />
    {children}
  </Button>
);
