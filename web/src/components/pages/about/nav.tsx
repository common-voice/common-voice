import * as React from 'react';
import throttle from 'lodash.throttle';

import cx from 'classnames';
import { SECTIONS } from './constants';
import { Localized } from '@fluent/react';
import { FlagIcon, LayersIcon, BookmarkIcon, HeartIcon } from '../../ui/icons';

import './nav.css';

interface Props {
  activeSection: string;
  navType: string;
}

const MENU_SECTIONS: any[] = [
  [SECTIONS.HOW_IT_WORKS, LayersIcon, { className: 'i2' }],
  [SECTIONS.PLAYBOOK, BookmarkIcon, { className: 'i3' }],
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

  const parentProps: any = {
    className: cx('nav', props.navType),
  };

  if (mobileBottom) {
    parentProps['style'] = { bottom: `${mobileBottom}px` };
  }

  return (
    <div {...parentProps}>
      {MENU_SECTIONS.map(([key, MobileIcon, { className, ...otherProps }]) => (
        <a
          key={key}
          className={cx('menu-item', className, {
            active: key === props.activeSection,
          })}
          href={`#${key}`}
          {...otherProps}>
          <Localized id={`about-nav-${key}`}>
            <div className="text" />
          </Localized>
        </a>
      ))}
    </div>
  );
});

export default Nav;
