import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOAL } from '../../../constants';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import {
  PlayButton,
  RecordButton,
} from '../../primary-buttons/primary-buttons';

import './hero.css';

const strings = {
  speak: {
    'subtitle-line-1': 'Donate',
    'subtitle-line-2': 'your voice',
    paragraph:
      "Recording voice clips is an integral part of building our open dataset; some would say it's the fun part too.",
    'goal-text': 'Clips recorded',
  },
  listen: {
    'subtitle-line-1': 'Help us',
    'subtitle-line-2': 'validate voices',
    paragraph:
      'Validating donated clips is equally as important to the Common Voice mission. Take a listen and help us create quality, open source voice data.',
    'goal-text': 'Clips validated',
  },
};

interface PropsFromState {
  api: API;
}

type State = {
  count: number;
  dimensions: { width: number; height: number }[];
  showToMeasure: boolean;
};

class Hero extends React.Component<
  {
    type: 'speak' | 'listen';
    status: 'active' | 'compressed' | null;
    onShow: () => any;
    onHide: () => any;
  } & PropsFromState,
  State
> {
  state: State = { count: null, dimensions: [], showToMeasure: true };

  toggleableRefs: any = Array.from({ length: 4 }).map(() => React.createRef());

  async componentDidMount() {
    window.addEventListener('resize', this.showToMeasure);
    this.measure();

    const { api, type } = this.props;
    this.setState({
      count: await (type === 'speak'
        ? api.fetchDailyClipsCount()
        : api.fetchDailyVotesCount()),
    });
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
    const { type, status, onShow, onHide } = this.props;
    const { count } = this.state;
    const isSpeak = type == 'speak';
    const s = strings[type];
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
              <span>{s['subtitle-line-1']}</span>
            </Localized>
            <span> </span>
            <Localized id={type + '-subtitle-line-2'}>
              <span>{s['subtitle-line-2']}</span>
            </Localized>
          </h3>
          <div {...this.getToggleableProps(0)}>
            <Localized id={type + '-paragraph'}>
              <p className="description">{s['paragraph']}</p>
            </Localized>
          </div>
        </div>
        <div className="column cta">
          {isSpeak ? (
            <RecordButton status={null} />
          ) : (
            <PlayButton isPlaying={false} />
          )}
          <div {...this.getToggleableProps(1, 'line ' + type)} />
          <div {...this.getToggleableProps(2)}>
            <Localized id="help-reach-goal" $goal={DAILY_GOAL[type]}>
              <div className="cta-message">
                Help us get to {DAILY_GOAL[type]}
              </div>
            </Localized>
          </div>
        </div>
        <div {...this.getToggleableProps(3, 'progress column')}>
          <Localized id="todays-progress">
            <h3 className="progress-title">Today's Progress</h3>
          </Localized>
          <span className="progress-count">
            <span className="current">{count === null ? '?' : count}</span>
            <span className="total">
              {' / '}
              {DAILY_GOAL[type]}
            </span>
          </span>
          <Localized id={type + '-goal-text'}>
            <p>{s['goal-text']}</p>
          </Localized>
        </div>
        <div className="gradient left" />
        <div className="gradient right" />
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(Hero);
