import * as React from 'react';

import './visually-hidden.css';

interface Props {
  children: React.ReactNode;
}

const VisuallyHidden = ({ children }: Props) => {
  return <div className="visually-hidden">{children}</div>;
};

export default VisuallyHidden;
