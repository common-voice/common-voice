import * as React from 'react';
import { Link } from 'react-router-dom';
import arrow from './assets/Button/arrow-right.svg';
import robot from './assets/Red.svg';
import wave1 from './assets/_1.svg';
import wave2 from './assets/_2.svg';
import wave3 from './assets/_3.svg';
import './intro.css';
import { useLocale } from '../../locale-helpers';
import { Localized, withLocalization } from 'fluent-react/compat';

export default withLocalization(function Intro() {
  const [_, toLocaleRoute] = useLocale();
  return (
    <div className="container">
      <div className="img-container">
        <div className="waves">
          <div className="layer"></div>
          <img src={wave1} className="wave-1" alt="wave" />
          <img src={wave2} className="wave-1" alt="" />
          <img src={wave3} className="wave-1" alt="wave" />
        </div>
        <img src={robot} className="robot" alt="red robot" />
      </div>
      <div className="text-box">
        <div className="text">
          <h1>
            <Localized id="welcome" />
          </h1>
          <p>
            <Localized id="welcome-subheader" />
          </p>
          <Link
            to={toLocaleRoute('/demo/language-select')}
            className="btn-get-started">
            <span>
              <Localized id="get-started" />
              <img src={arrow} alt="arrow right" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});
