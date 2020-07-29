import * as cx from 'classnames';
import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState, useRef } from 'react';
import { trackHome } from '../../services/tracker';
import { BENEFITS, WHATS_PUBLIC } from '../../constants';
import { useLocale } from '../locale-helpers';

import './register-section.css';

export default function RegisterSection({
  children,
  flipped = false,
  marsSrc,
}: {
  children?: React.ReactNode[];
  flipped?: boolean;
  marsSrc?: string;
}) {
  const [locale] = useLocale();
  const [index, setIndex] = useState(0);
  const [tab, setTab] = useState('benefits');
  const isBenefits = tab == 'benefits';
  const demoMode = marsSrc == null;
  const ulElement = useRef<HTMLUListElement>(null);
  var lastScrollTop = 0;

  const handleSroll = () => {
    let root = ulElement.current;
    let activeChild = root.children[index];
    let { top } = activeChild.getBoundingClientRect();
    var st =
      root.getBoundingClientRect().top -
      root.children[0].getBoundingClientRect().top; //used to monitor scroll direction
    let nextIndex;
    if (st > lastScrollTop) {
      // downscroll code
      nextIndex =
        index + 1 < (isBenefits ? BENEFITS.length : WHATS_PUBLIC.length)
          ? index + 1
          : index;
      if (top <= 30) {
        setIndex(nextIndex);
      }
    } else {
      // upscroll code
      nextIndex = index - 1 >= 0 ? index - 1 : index;
      let nextActiveChild = root.children[nextIndex];
      if (nextActiveChild.getBoundingClientRect().top >= 30) {
        setIndex(nextIndex);
      }
    }
    lastScrollTop = st <= 0 ? 0 : st;
  };

  const info = (
    <div className="signup-info">
      <div className="tabs">
        {marsSrc && (
          <img
            className="waves"
            src={require('./images/waves.png')}
            alt="Waves"
          />
        )}
        {['benefits', 'whats-public'].map(l => (
          <label key={l}>
            <input
              type="radio"
              name="tab"
              checked={tab == l}
              onChange={() => {
                setTab(l);
                setIndex(0);
                trackHome('change-benefits-tabs', locale);
              }}
            />
            <Localized id={l}>
              <div />
            </Localized>
          </label>
        ))}
      </div>
      <div className="list-and-bg">
        <div className="bg" />
        <ul key={tab} onScroll={demoMode ? handleSroll : null} ref={ulElement}>
          {(isBenefits ? BENEFITS : WHATS_PUBLIC).map((l, i) => (
            <li
              key={l}
              className={i == index ? 'active' : ''}
              onClick={() => {
                setIndex(i);
                trackHome(
                  isBenefits
                    ? 'click-benefits-item'
                    : 'click-whats-public-item',
                  locale
                );
              }}>
              <span>{i + 1}.</span>
              <Localized id={l}>
                <span />
              </Localized>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <section className={cx('register-section', { flipped })}>
      <div className="top">
        <div className="cta-container">
          {children}
          {info}
        </div>
        <div className="images-container">
          {marsSrc && <img className="mars" src={marsSrc} alt="Mars" />}
          <img
            className="screenshot"
            src={require(`./images/${isBenefits ? 1 : 2}-${index + 1}.png`)}
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
