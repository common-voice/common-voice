import { Localized } from 'fluent-react';
import * as React from 'react';
import { DAILY_GOAL } from '../../../constants';
import {
  PlayButton,
  RecordButton,
} from '../../primary-buttons/primary-buttons';

import './hero.css';

type State = {
  dimensions: { width: number; height: number }[];
  showToMeasure: boolean;
};

export default class Hero extends React.Component<
  {
    type: 'speak' | 'listen';
    status: 'active' | 'compressed' | null;
    count: number;
    onShow: () => any;
    onHide: () => any;
  },
  State
> {
  state: State = { dimensions: [], showToMeasure: true };

  toggleableRefs: any = Array.from({ length: 4 }).map(() => React.createRef());

  componentDidMount() {
    window.addEventListener('resize', this.showToMeasure);
    this.measure();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.showToMeasure);
  }

  componentDidUpdate() {
    if (this.state.showToMeasure) {
      this.measure();
    }
  }

  showToMeasure = () => this.setState({ showToMeasure: true });

  measure() {
    this.setState({
      dimensions: this.toggleableRefs.map(
        ({ current: { offsetWidth, offsetHeight } }: any) => ({
          width: offsetWidth,
          height: offsetHeight,
        })
      ),
      showToMeasure: false,
    });
  }

  getToggleableProps(i: number, className = '') {
    const { status } = this.props;
    const { dimensions, showToMeasure } = this.state;
    return {
      ref: this.toggleableRefs[i],
      className: 'toggleable ' + className,
      style: showToMeasure
        ? {}
        : status === 'active' ? dimensions[i] : { width: 0, height: 0 },
    };
  }

  render() {
    const { type, status, count, onShow, onHide } = this.props;
    const isSpeak = type == 'speak';
    return (
      <div
        className={['hero-box', type, status].join(' ')}
        onClick={onShow}
        onMouseEnter={onShow}
        onMouseLeave={onHide}>
        <div className="column title">
          <Localized id={type}>
            <h1 />
          </Localized>
          <h3>
            <Localized id={type + '-subtitle-line-1'}>
              <span />
            </Localized>
            <br className="md-block" />
            <span> </span>
            <Localized id={type + '-subtitle-line-2'}>
              <span />
            </Localized>
          </h3>
          <div {...this.getToggleableProps(0)}>
            <Localized id={type + '-paragraph'}>
              <p className="description" />
            </Localized>
          </div>
        </div>
        <div className="column cta">
          <div {...this.getToggleableProps(1)}>
            <Localized id="help-reach-goal" $goal={DAILY_GOAL[type]}>
              <div className="cta-message" />
            </Localized>
          </div>
          <div {...this.getToggleableProps(2, 'line ' + type)} />
          {isSpeak ? (
            <RecordButton status={null} />
          ) : (
            <PlayButton isPlaying={false} />
          )}
        </div>
        <div {...this.getToggleableProps(3, 'progress column')}>
          <Localized id="todays-progress">
            <h3 />
          </Localized>
          <span className="progress-count">
            <span className="current">{count}</span>
            <span className="total">
              {' / '}
              {DAILY_GOAL[type]}
            </span>
          </span>
          <Localized id={type + '-goal-text'}>
            <p />
          </Localized>
        </div>
        <div className="gradient left" />
        <div className="gradient right" />
      </div>
    );
  }
}
