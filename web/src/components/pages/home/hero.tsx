import { Localized } from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOALS } from '../../../constants';
import API from '../../../services/api';
import { trackHome } from '../../../services/tracker';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { PlayLink, RecordLink } from '../../primary-buttons/primary-buttons';

import './hero.css';

interface PropsFromState {
  api: API;
  locale: Locale.State;
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
        : status === 'active'
        ? dimensions[i]
        : { width: 0, height: 0 },
    };
  }

  render() {
    const { locale, onHide, onShow, status, type } = this.props;
    const { count } = this.state;
    const isSpeak = type == 'speak';
    const PrimaryLink = isSpeak ? RecordLink : PlayLink;
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
          <PrimaryLink
            trackClass={`${type}-from-home`}
            onClick={() => trackHome(type, locale)}
          />
          <div {...this.getToggleableProps(1, 'line ' + type)} />
          <div {...this.getToggleableProps(2)}>
            <Localized
              id="help-reach-goal"
              vars={{ goal: type === 'speak' ? 'أسمعنا صوتك' : 'استمع واستمتع' }}>
              <div className="cta-message" />
            </Localized>
          </div>
        </div>
        <div {...this.getToggleableProps(3, 'progress column')}>
          <Localized id="todays-progress">
            <h3 className="progress-title" />
          </Localized>
          <span className="progress-count">
            <span className="current">{count === null ? '?' : count}</span>
            <span className="total">
              {/* {' / '}
              {DAILY_GOALS[type][0]} */}
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

const mapStateToProps = ({ api, locale }: StateTree) => ({
  api,
  locale,
});

export default connect<PropsFromState>(mapStateToProps)(Hero);
