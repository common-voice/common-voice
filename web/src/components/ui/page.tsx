import * as React from 'react';
import classNames from 'classnames';

import './page.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  isCentered?: boolean;
}
const Page = ({ children, className, isCentered = false }: Props) => {
  return (
    <div className={classNames('page', className)}>
      <div className={classNames({ page__wrapper: isCentered })}>
        {children}
      </div>
    </div>
  );
};

export default Page;
