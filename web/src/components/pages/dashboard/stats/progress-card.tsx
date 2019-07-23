import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { CustomGoal } from 'common/goals';
import { DAILY_GOAL } from '../../../../constants';
import API from '../../../../services/api';
import { trackDashboard } from '../../../../services/tracker';
import URLS from '../../../../urls';
import { Locale } from '../../../../stores/locale';
import StateTree from '../../../../stores/tree';
import { ALL_LOCALES } from '../../../language-select/language-select';
import { toLocaleRouteBuilder } from '../../../locale-helpers';
import { MicIcon, OldPlayIcon } from '../../../ui/icons';
import { LinkButton } from '../../../ui/ui';
import { CircleProgress, Fraction } from '../ui';

import './progress-card.css';

interface PropsFromState {
  api: API;
  customGoals: CustomGoal[];
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
      customGoals,
      personalCurrent,
      personalGoal,
      type,
    } = this.props;
    const { overallCurrent } = this.state;

    const overallGoal = DAILY_GOAL[type];
    const isSpeak = type == 'speak';
    const customGoal = customGoals.find(g => g.locale == locale);
    const currentCustomGoal = customGoal ? customGoal.current[type] : undefined;
    const hasCustomGoalForThis = currentCustomGoal !== undefined;
    return (
      <div className={'progress-card ' + type}>
        <div className="personal">
          {hasCustomGoalForThis ? (
            <Fraction
              numerator={currentCustomGoal}
              denominator={customGoal.amount}
            />
          ) : (
            <Fraction
              numerator={
                typeof personalCurrent == 'number' ? personalCurrent : '?'
              }
              denominator={
                (personalGoal == Infinity ? (
                  <div className="infinity">∞</div>
                ) : (
                  personalGoal
                )) || '?'
              }
            />
          )}
          <Localized
            id={isSpeak ? 'clips-you-recorded' : 'clips-you-validated'}>
            <div className="description" />
          </Localized>
          <div className="custom-goal-section">
            {customGoal && hasCustomGoalForThis ? (
              <Link className="custom-goal-link" to={URLS.GOALS}>
                <CircleProgress value={currentCustomGoal / customGoal.amount} />
                <div className="custom-goal-text">
                  <Localized id="toward-next-goal">
                    <span />
                  </Localized>
                </div>
              </Link>
            ) : (
              !customGoal &&
              locale !== ALL_LOCALES && (
                <Localized id="create-custom-goal">
                  <LinkButton
                    className="custom-goal-button"
                    rounded
                    to={URLS.GOALS}
                  />
                </Localized>
              )
            )}
          </div>
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
          </div>
        </div>

        <div className="overall">
          <Fraction
            numerator={overallCurrent == null ? '?' : overallCurrent}
            denominator={overallGoal}
          />
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

export default connect<PropsFromState>(({ api, locale, user }: StateTree) => ({
  api,
  customGoals: user.account.custom_goals,
  globalLocale: locale,
}))(ProgressCard);
