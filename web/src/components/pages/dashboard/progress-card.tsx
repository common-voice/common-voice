import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { DAILY_GOAL } from '../../../constants';
import API from '../../../services/api';
import { trackDashboard } from '../../../services/tracker';
import URLS from '../../../urls';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { ALL_LOCALES } from '../../language-select/language-select';
import { toLocaleRouteBuilder } from '../../locale-helpers';
import { MicIcon, OldPlayIcon } from '../../ui/icons';
import { LinkButton } from '../../ui/ui';

import './progress-card.css';

interface PropsFromState {
  api: API;
  globalLocale: Locale.State;
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
    let { api, globalLocale, locale, type } = this.props;
    const isAllLanguages = locale == ALL_LOCALES;
    if (!isAllLanguages) {
      trackDashboard('change-language', globalLocale);
    }
    api = api.forLocale(isAllLanguages ? null : locale);
    this.setState({
      overallCurrent: await (type === 'speak'
        ? api.fetchDailyClipsCount()
        : api.fetchDailyVotesCount()),
    });
  }

  render() {
    const {
      globalLocale,
      locale,
      personalCurrent,
      personalGoal,
      type,
    } = this.props;
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
          <Localized
            id={isSpeak ? 'clips-you-recorded' : 'clips-you-validated'}>
            <div className="description" />
          </Localized>
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
          <Localized
            id={
              isSpeak ? 'todays-recorded-progress' : 'todays-validated-progress'
            }>
            <div className="description" />
          </Localized>
          <Localized id="help-reach-goal" $goal={overallGoal}>
            <LinkButton
              rounded
              outline
              absolute
              to={toLocaleRouteBuilder(
                locale == ALL_LOCALES ? globalLocale : locale
              )(isSpeak ? URLS.SPEAK : URLS.LISTEN)}
              onClick={() =>
                trackDashboard(
                  isSpeak ? 'speak-cta' : 'listen-cta',
                  globalLocale
                )
              }
            />
          </Localized>
        </div>
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api, locale }: StateTree) => ({
  api,
  globalLocale: locale,
}))(ProgressCard);
