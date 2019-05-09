import * as React from 'react';
import * as cx from 'classnames';
import { SECTIONS } from './constants';
import { Localized } from 'fluent-react/compat';
import { FlagIcon, LayersIcon, UsersIcon, HeartIcon } from '../../ui/icons';

const throttle = require('lodash.throttle');

import './nav.css';

interface Props {
  activeSection: string;
  navType: string;
}

const MENU_SECTIONS: any[] = [
  [
    SECTIONS.WHY_COMMON_VOICE,
    ['menu1-active.png', 'menu1-inactive.png'],
    FlagIcon,
    { className: 'i1' },
  ],
  [
    SECTIONS.HOW_IT_WORKS,
    ['menu2-active.png', 'menu2-inactive.png'],
    LayersIcon,
    { className: 'i2' },
  ],
  // [
  //   SECTIONS.PARTNERS,
  //   ['menu3-active.png', 'menu3-inactive.png'],
  //   UsersIcon,
  //   { className: 'i3' },
  // ],
  [
    SECTIONS.GET_INVOLVED,
    ['menu4-active.png', 'menu4-inactive.png'],
    HeartIcon,
    { className: 'i4' },
  ],
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
      {MENU_SECTIONS.map(
        ([
          key,
          [activeBg, inactiveBg],
          MobileIcon,
          { className, ...otherProps },
        ]) => (
          <a
            key={key}
            className={cx('menu-item', className, {
              active: key === props.activeSection,
            })}
            href={`#${key}`}
            {...otherProps}>
            <img src={require(`./images/nav/${inactiveBg}`)} />
            <img src={require(`./images/nav/${activeBg}`)} className="active" />

            {props.navType === 'mobile' && (
              <>
                <img
                  src={require('./images/nav/nav-mobile.png')}
                  className="mobile-rounded"
                />

                <MobileIcon />
              </>
            )}

            <Localized id={`about-nav-${key}`}>
              <div className="text" />
            </Localized>
          </a>
        )
      )}
    </div>
  );
});

export default Nav;
