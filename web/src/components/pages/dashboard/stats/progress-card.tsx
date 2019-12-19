import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { DAILY_GOAL } from '../../../../constants';
import { useAccount, useAPI } from '../../../../hooks/store-hooks';
import { trackDashboard } from '../../../../services/tracker';
import URLS from '../../../../urls';
import {
  LocaleLink,
  toLocaleRouteBuilder,
  useLocale,
} from '../../../locale-helpers';
import { MicIcon, OldPlayIcon } from '../../../ui/icons';
import { LinkButton } from '../../../ui/ui';
import { CircleProgress, Fraction } from '../ui';

import './progress-card.css';

interface Props {
  type: 'speak' | 'listen';
  locale: string;
  personalCurrent?: number;
  personalGoal?: number;
}

export default function ProgressCard({
  locale,
  personalCurrent,
  personalGoal,
  type,
}: Props) {
  const [globalLocale] = useLocale();
  const { custom_goals: customGoals } = useAccount() || {};
  let api = useAPI();
  const [overallCurrent, setOverallCurrent] = useState(null);

  async function fetchAndSetOverallCount() {
    if (!locale) {
      trackDashboard('change-language', globalLocale);
    }
    api = api.forLocale(locale || null);
    setOverallCurrent(
      await (type === 'speak'
        ? api.fetchDailyClipsCount()
        : api.fetchDailyVotesCount())
    );
  }

  useEffect(() => {
    fetchAndSetOverallCount();
  }, []);

  const overallGoal = DAILY_GOAL[type];
  const isSpeak = type == 'speak';
  const customGoal = customGoals.find(g => g.locale == locale);
  const currentCustomGoal = customGoal ? customGoal.current[type] : undefined;
  const hasCustomGoalForThis = currentCustomGoal !== undefined;
  const goalsPath = URLS.DASHBOARD + (locale ? '/' + locale : '') + URLS.GOALS;

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
        <Localized id={isSpeak ? 'clips-you-recorded' : 'clips-you-validated'}>
          <div className="description" />
        </Localized>
        <div className="custom-goal-section">
          {customGoal && hasCustomGoalForThis ? (
            <LocaleLink className="custom-goal-link" to={goalsPath}>
              <CircleProgress value={currentCustomGoal / customGoal.amount} />
              <div className="custom-goal-text">
                <Localized id="toward-next-goal">
                  <span />
                </Localized>
              </div>
            </LocaleLink>
          ) : (
            !customGoal && (
              <Localized id="create-custom-goal">
                <LinkButton
                  className="custom-goal-button"
                  rounded
                  to={goalsPath}
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
            to={toLocaleRouteBuilder(locale || globalLocale)(
              isSpeak ? URLS.SPEAK : URLS.LISTEN
            )}
            onClick={() =>
              trackDashboard(isSpeak ? 'speak-cta' : 'listen-cta', globalLocale)
            }
          />
        </Localized>
      </div>
    </div>
  );
}
