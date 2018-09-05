import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOAL } from '../../../constants';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { PlayLink, RecordLink } from '../../primary-buttons/primary-buttons';

import './hero.css';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';

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
            <Localized id={type + '-subtitle'}>
              <span />
            </Localized>
          </h3>
          <div {...this.getToggleableProps(0)}>
            <Localized id={type + '-paragraph'}>
              <p className="description" />
            </Localized>
            <Localized id="read-terms-q">
              <LocaleLink to={URLS.TERMS} className="terms" />
            </Localized>
          </div>
        </div>
        <div className="column cta">
          {isSpeak ? <RecordLink /> : <PlayLink />}
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
          <p>
            <Localized id={type + '-goal-text'}>
              <i />
            </Localized>
          </p>
        </div>
        <div className="fading" />
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(Hero);
