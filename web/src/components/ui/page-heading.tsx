import classNames from 'classnames';
import * as React from 'react';

import './page-heading.css';

interface Props {
  children: React.ReactNode;
  isLight?: boolean;
}
const PageHeading = ({ children, isLight = false }: Props) => {
  return (
    <h1
      className={classNames('page-heading', {
        'page-heading--is-light': isLight,
      })}>
      {children}
    </h1>
  );
};

export default PageHeading;
