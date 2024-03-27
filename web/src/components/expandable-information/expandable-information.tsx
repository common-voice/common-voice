import * as React from 'react';
import { Localized } from '@fluent/react';
import classNames from 'classnames';

import { ChevronDown } from '../ui/icons';

import './expandable-information.css';

interface Props {
  summaryLocalizedId: string;
  children: React.ReactNode;
  icon?: JSX.Element;
  hideBorder?: boolean;
  justifyCenter?: boolean;
  onToggle?: (evt: React.SyntheticEvent<HTMLDetailsElement>) => void;
  dataTestId?: string;
}

const ExpandableInformation = ({
  summaryLocalizedId,
  children,
  icon,
  hideBorder,
  justifyCenter,
  onToggle,
  dataTestId,
}: Props) => {
  return (
    <details
      className={classNames('expandable-information', {
        'hide-border': hideBorder,
      })}
      onToggle={onToggle}
      data-testid={dataTestId}>
      <summary
        className={classNames('expandable-information__summary', {
          'justify-center': justifyCenter,
        })}>
        {icon}
        <Localized id={summaryLocalizedId}>
          <span />
        </Localized>

        <ChevronDown className="expandable-information__summary__arrow" />
      </summary>
      <div className="expandable-information__text">{children}</div>
    </details>
  );
};

export default ExpandableInformation;
