import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOAL } from '../../../constants';
import API from '../../../services/api';
import URLS from '../../../urls';
import StateTree from '../../../stores/tree';
import { MicIcon, OldPlayIcon } from '../../ui/icons';
import { LinkButton } from '../../ui/ui';

import './progress-card.css';
import { trackDashboard } from '../../../services/tracker';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {
  type: 'speak' | 'listen';
  locale: string;
  personalCurrent?: number;
  personalGoal?: number;
}

interface State {
  overallCurrent: number;
}

class ProgressCard extends React.Component<Props, State> {
  state: State = { overallCurrent: null };

  async componentDidMount() {
    let { api, locale, type } = this.props;
    const isAllLanguages = locale == 'all-languages';
    if (!isAllLanguages) {
      trackDashboard('change-language');
    }
    api = api.forLocale(isAllLanguages ? null : locale);
    this.setState({
      overallCurrent: await (type === 'speak'
        ? api.fetchDailyClipsCount()
        : api.fetchDailyVotesCount()),
    });
  }

  render() {
    const { personalCurrent, personalGoal, type } = this.props;
    const { overallCurrent } = this.state;

    const overallGoal = DAILY_GOAL[type];
    const isSpeak = type == 'speak';
    return (
      <div className={'progress-card ' + type}>
        <div className="personal">
          <div className="numbers">
            <div className="current">
              {typeof personalCurrent == 'number' ? personalCurrent : '?'}
            </div>
            <div className="total">
              {' / '}
              {(personalGoal == Infinity ? (
                <div className="infinity">∞</div>
              ) : (
                personalGoal
              )) || '?'}
            </div>
          </div>
          <div className="description">
            Clips You've {isSpeak ? 'Recorded' : 'Validated'}
          </div>
          <div />
        </div>

        <div className="progress-wrap">
          <div className="progress">
            <div className="icon-wrap">
              {isSpeak ? (
                <MicIcon />
              ) : (
                <OldPlayIcon style={{ position: 'relative', left: 3 }} />
              )}
            </div>
            <div className="bar">
              <div
                className="current"
                style={{
                  width:
                    Math.min(
                      (100 * (personalCurrent || 0)) / (personalGoal || 1),
                      100
                    ) + '%',
                }}
              />
            </div>
          </div>
        </div>

        <div className="overall">
          <div className="numbers">
            <div className="current">
              {overallCurrent == null ? '?' : overallCurrent}
            </div>
            <div className="total">
              {' / '}
              {overallGoal}
            </div>
          </div>
          <div className="description">
            Today's Common Voice progress on clips{' '}
            {isSpeak ? 'recorded' : 'validated'}
          </div>
          <LinkButton
            rounded
            outline
            to={isSpeak ? URLS.SPEAK : URLS.LISTEN}
            onClick={() =>
              trackDashboard(isSpeak ? 'speak-cta' : 'listen-cta')
            }>
            Help us get to {overallGoal}
          </LinkButton>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api }: StateTree) => ({ api }))(
  ProgressCard
);
