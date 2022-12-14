import * as React from 'react';
import { Link } from 'react-router-dom';
import throttle from 'lodash.throttle';

import cx from 'classnames';
import { SECTIONS } from './constants';
import { Localized } from '@fluent/react';

import './nav.css';

interface Props {
  activeSection: string;
  navType: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MENU_SECTIONS: any[] = [
  [SECTIONS.HOW_IT_WORKS, { className: 'i2' }],
  [SECTIONS.PLAYBOOK, { className: 'i3' }],
];

const Nav: React.ComponentType<Props> = React.memo((props: Props) => {
  const [mobileBottom, setMobileBottom] = React.useState<number>(0);

  React.useEffect(() => {
    if (props.navType !== 'mobile') {
      return;
    }

    const updateMobileBottomPosition = throttle(() => {
      setMobileBottom(
        document.documentElement.clientHeight - window.innerHeight
      );
    });

    setTimeout(updateMobileBottomPosition, 0);

    window.addEventListener('resize', updateMobileBottomPosition);

    return () => {
      window.removeEventListener('resize', updateMobileBottomPosition);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentProps: any = {
    className: cx('nav', props.navType),
  };

  if (mobileBottom) {
    parentProps['style'] = { bottom: `${mobileBottom}px` };
  }

  return (
    <div {...parentProps}>
      {/* {MENU_SECTIONS.map(([key, { className, ...otherProps }]) => (
        <Link
          key={key}
          className={cx('menu-item', className, {
            active: key === props.activeSection,
          })}
          to={`#${key}`}
          {...otherProps}>
          <Localized id={`about-nav-${key}`}>
            <div className="text" />
          </Localized>
        </Link>
      ))} */}
    </div>
  );
});

Nav.displayName = 'Nav';

export default Nav;
