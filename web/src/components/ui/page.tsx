import * as React from 'react';
import classNames from 'classnames';

import './page.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  isCentered?: boolean;
  dataTestId?: string;
}
const Page = ({
  children,
  className,
  isCentered = false,
  dataTestId,
}: Props) => {
  return (
    <div className={classNames('page', className)} data-testid={dataTestId}>
      <div className={classNames({ page__wrapper: isCentered })}>
        {children}
      </div>
    </div>
  );
};

export default Page;
