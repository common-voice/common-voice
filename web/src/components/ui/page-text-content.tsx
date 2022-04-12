import * as React from 'react';

import './page-text-content.css';

interface Props {
  children: React.ReactNode;
}

const PageTextContent = ({ children }: Props) => {
  return <div className="page-text-content">{children}</div>;
};

export default PageTextContent;
