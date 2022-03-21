import * as React from 'react';

import './page-heading.css';

interface Props {
  children: React.ReactNode;
}
const PageHeading = ({ children }: Props) => {
  return <h1 className="page-heading">{children}</h1>;
};

export default PageHeading;
