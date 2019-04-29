import * as React from 'react';
import * as cx from 'classnames';
import { useReducer } from 'react';
import { ChevronRight } from '../../ui/icons';
import { Localized } from 'fluent-react/compat';

type Slide = {
  title: string;
  subtitle: string;
  description: string;
  secondaryDescription: string;
  logo: any;
};

interface SliderState {
  slides: Slide[];
  activeSlide: number;
  nextSlide: number | null;
  prevSlide: number | null;
}

const initialState: SliderState = {
  slides: [
    {
      title: 'mycroft-title',
      subtitle: 'mycroft-subtitle',
      description: 'mycroft-description',
      secondaryDescription: 'mycroft-secondary-description',
      logo: require('./images/partner-logo/mycroftAI.jpg'),
    },
  ],
  activeSlide: 0,
  nextSlide: null, // 1
  prevSlide: null,
};

type Reducer = (state: SliderState, action: any) => any;

const reducer: Reducer = (state: SliderState, action: any) => {
  switch (action.type) {
    case 'next':
    case 'prev':
      const activeSlide =
        action.type === 'next' ? state.nextSlide : state.prevSlide;

      if (activeSlide === null) {
        return state;
      }

      return {
        ...state,
        activeSlide,
        nextSlide:
          activeSlide + 1 < state.slides.length ? activeSlide + 1 : null,
        prevSlide: activeSlide >= 1 ? activeSlide - 1 : null,
      };

    default:
      throw new Error();
  }
};

const Slider: React.ComponentType = () => {
  const [{ slides, activeSlide, nextSlide, prevSlide }, dispatch] = useReducer<
    Reducer
  >(reducer, initialState);

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
            <img src={slides[activeSlide].logo} alt="" />
          </div>
        </div>

        <div className="slider-content">
          <div className="slider-controls">
            <div className="count">
              <span>{`${activeSlide + 1}`.padStart(2, '0')}</span>
              {` / `}
              {`${slides.length}`.padStart(2, '0')}
            </div>
            <div className="line" />
            <div className="arrows">
              <div
                className={cx('slider-arrow', { disabled: prevSlide === null })}
                onClick={() => dispatch({ type: 'prev' })}>
                <ChevronRight />
              </div>
              <div
                className={cx('slider-arrow', { disabled: nextSlide === null })}
                onClick={() => dispatch({ type: 'next' })}>
                <ChevronRight />
              </div>
            </div>
          </div>

          <div
            className="slides-viewport"
            style={{ left: `-${activeSlide * 100}%` }}>
            {slides.map((slide: Slide, index: number) => (
              <div key={`slider-${index}`} className="slider-data">
                <div className="partner-name">
                  <Localized id={slide.subtitle}>
                    <div className="subtitle" />
                  </Localized>
                  <Localized id={slide.title}>
                    <h1 />
                  </Localized>
                </div>
                <div className="partner-description">
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
