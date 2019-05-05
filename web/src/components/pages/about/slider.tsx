import * as React from 'react';
import * as cx from 'classnames';
import { ChevronRight } from '../../ui/icons';
import { Localized } from 'fluent-react/compat';

import './slider.css';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription: string;
  logo: any;
};

const Slides: Slide[] = [
  {
    title: 'mycroft-title',
    subtitle: 'mycroft-subtitle',
    description: 'mycroft-description',
    secondaryDescription: 'mycroft-secondary-description',
    logo: require('./images/partner-logo/mycroftAI.jpg'),
  },
];

const Slider: React.ComponentType = () => {
  const [activeSlide, setActiveSlide] = React.useState<number>(0);
  const lastSlideIndex = Slides.length - 1;

  return (
    <div className="partner-slider">
      <div className="slider-container">
        <img
          className="dots-right"
          src={require('./images/slider-dots.png')}
          alt=""
        />
        <div className="partner-logo-container">
          <div className="partner-logo">
            <img src={Slides[activeSlide].logo} alt="" />
          </div>
        </div>

        <div className="slider-content">
          <div className="slider-controls">
            <div className="count">
              <span>{`${activeSlide + 1}`.padStart(2, '0')}</span>
              {` / `}
              {`${Slides.length}`.padStart(2, '0')}
            </div>
            <div className="line" />
            <div className="arrows">
              <div
                className={cx('slider-arrow', { disabled: activeSlide === 0 })}
                onClick={() => {
                  if (activeSlide !== 0) {
                    setActiveSlide(activeSlide - 1);
                  }
                }}>
                <ChevronRight />
              </div>
              <div
                className={cx('slider-arrow', {
                  disabled: activeSlide === lastSlideIndex,
                })}
                onClick={() => {
                  if (activeSlide !== lastSlideIndex) {
                    setActiveSlide(activeSlide + 1);
                  }
                }}>
                <ChevronRight />
              </div>
            </div>
          </div>

          <div
            className="slides-viewport"
            style={{ left: `-${activeSlide * 100}%` }}>
            {Slides.map((slide: Slide, index: number) => (
              <div key={`slider-${index}`} className="slider-data">
                <div className="partner-name">
                  <Localized id={slide.subtitle}>
                    <div className="subtitle" />
                  </Localized>
                  <Localized id={slide.title}>
                    <h1 />
                  </Localized>
                </div>
                <div className="partner-text">
                  <Localized id={slide.description}>
                    <p className="large" />
                  </Localized>
                  <Localized id={slide.secondaryDescription}>
                    <p />
                  </Localized>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;
