import * as React from 'react';

import './round-button.css';

interface Props {
  children: React.ReactNode;
}

const RoundButton = ({ children }: Props) => {
  return <div className="round-button">{children}</div>;
};

export default RoundButton;
