import cx from 'classnames';
import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
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
        <ul key={tab}>
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
            role="presentation"
          />
        </div>
      </div>
    </section>
  );
}
