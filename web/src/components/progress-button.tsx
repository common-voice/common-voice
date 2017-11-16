import * as React from 'react';

interface Props {
  disabled: boolean;
  percent: number;
  text: string;
  onClick?(): void;
}

export default ({ disabled, percent, text, onClick }: Props) => (
  <button className="progress-button" onClick={onClick} disabled={disabled}>
    <span
      className="progress"
      style={{ transform: `translateX(${percent - 100}%)` }}
    />
    {text}
  </button>
);
