import { Localized } from '@fluent/react';
import * as React from 'react';
import { useState } from 'react';
import { CustomGoalParams } from 'common';
import { useAccount, useAction, useAPI } from '../../../../hooks/store-hooks';
import { User } from '../../../../stores/user';
import Modal from '../../../modal/modal';
import { PenIcon } from '../../../ui/icons';
import steps, { ViewGoal } from './custom-goal-steps';

import { useRouter } from '../../../../hooks/use-router';
import { Radio } from '../../../ui/ui';

import './custom-goal.css';

const STATE_KEYS: ReadonlyArray<keyof CustomGoalParams> = [
  null, // first step has no state
  'daysInterval',
  'amount',
  'type',
];

const STEPS = {
  INTRO: 0,
  EDIT_START: 1,
  SUBMIT: 4,
  COMPLETED: 5,
};

function StepButtons({
  setStepIndex,
  state,
  stepIndex,
  touchedStepIndex,
}: {
  setStepIndex: (index: number) => void;
  state: CustomGoalParams;
  stepIndex: number;
  touchedStepIndex: number;
}) {
  return (
    <div className="padded step-buttons">
      {stepIndex > 0 &&
        stepIndex < 5 &&
        [...(Array(4) as any).keys()].map(i => {
          const n = i + 1;
          const isCompleted =
            state[STATE_KEYS[n]] != null && touchedStepIndex >= n;
          const isActive = n == stepIndex;
          return (
            <React.Fragment key={i}>
              <div
                className={[
                  'step-button',
                  isActive ? 'active' : '',
                  isCompleted ? 'completed' : '',
                ].join(' ')}>
                <button
                  type="button"
                  onClick={() => setStepIndex(n)}
                  disabled={n > 1 && state[STATE_KEYS[n - 1]] == null}>
                  {n}
                </button>
              </div>
              {n < 4 && (
                <>
                  <div
                    className={
                      'line ' + (isCompleted || isActive ? 'fill' : '')
                    }
                  />
                  <div className={'line ' + (isCompleted ? 'fill' : '')} />
                </>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

function CompletedFields({
  setStepIndex,
  state,
  states,
  stepIndex,
}: {
  setStepIndex: (index: number) => void;
  state: CustomGoalParams;
  states: any;
  stepIndex: number;
}) {
  const completedStates =
    stepIndex > STEPS.SUBMIT ? [] : STATE_KEYS.slice(1, stepIndex);
  return (
    <div className="fields completed">
      {completedStates.map(stateKey => {
        if (!states[stateKey]) return null;
        const [labelId, value] = states[stateKey].find(
          ([, value]: any) => value == state[stateKey]
        );
        return (
          <Radio
            key={stateKey}
            checked
            disabled
            labelClass="box"
            contentClass="content">
            <Localized
              {...(stateKey == 'amount'
                ? { id: 'n-clips-pluralized', vars: { count: value } }
                : {
                    id:
                      stateKey == 'type' && value == 'both'
                        ? 'both-speak-and-listen-long'
                        : labelId,
                  })}>
              <span />
            </Localized>
            <button
              type="button"
              onClick={() =>
                setStepIndex(STATE_KEYS.findIndex(k => k == stateKey))
              }>
              <PenIcon />
            </button>
          </Radio>
        );
      })}
    </div>
  );
}

function CurrentFields({
  setState,
  state,
  states,
  stepIndex,
}: {
  setState: (state: CustomGoalParams) => void;
  state: CustomGoalParams;
  states: any;
  stepIndex: number;
}) {
  const currentStateKey = STATE_KEYS[stepIndex];
  return (
    <div className="fields">
      {(states[currentStateKey] || []).map(([labelId, value]: any) =>
        value == null ? null : (
          <Radio
            key={value}
            name={currentStateKey}
            checked={value == state[currentStateKey]}
            onChecked={() =>
              setState({
                ...state,
                [currentStateKey]: value,
                // reset following states
                ...STATE_KEYS.slice(stepIndex + 1).reduce(
                  (obj: any, key: string) => {
                    obj[key] = null;
                    return obj;
                  },
                  {}
                ),
              })
            }
            labelClass="box"
            contentClass="content">
            {currentStateKey == 'amount' ? (
              <>
                <Localized id="n-clips-pluralized" vars={{ count: value }}>
                  <span />
                </Localized>
                <Localized id={labelId}>
                  <span className="right" />
                </Localized>
              </>
            ) : (
              <Localized id={labelId}>
                <span />
              </Localized>
            )}
          </Radio>
        )
      )}
    </div>
  );
}

export default function CustomGoal({
  dashboardLocale,
}: {
  dashboardLocale: string;
}) {
  const { history, location } = useRouter();
  const api = useAPI();
  const account = useAccount();
  const { custom_goals, email } = account || {};
  const customGoal = custom_goals?.find(g => g.locale == dashboardLocale);
  const refreshUser = useAction(User.actions.refresh);
  const saveAccount = useAction(User.actions.saveAccount);

  const hasStartParam = location.search.includes('start');
  const [stepIndex, setStepIndex] = useState(
    !customGoal && hasStartParam ? STEPS.EDIT_START : STEPS.INTRO
  );
  if (hasStartParam) {
    history.replace(location.pathname);
  }

  const [touchedStepIndex, setTouchedStepIndex] = useState(STEPS.INTRO);
  const [subscribed, setSubscribed] = useState(false);
  const initialState = customGoal
    ? {
        daysInterval: customGoal.days_interval,
        amount: customGoal.amount,
        type:
          Object.keys(customGoal.current).length == 1
            ? Object.keys(customGoal.current)[0]
            : 'both',
      }
    : {
        daysInterval: null,
        amount: null,
        type: null,
      };
  const [state, setState] = useState<CustomGoalParams>(initialState);
  const [showOverwriteModal, setShowOverwriteModal] = useState(false);
  const [showAbortEditModal, setShowAbortEditModal] = useState(false);

  const Step = steps[stepIndex];

  const states: any = {
    daysInterval: [
      ['daily-goal', 1],
      ['weekly-goal', 7],
    ],
    amount: [
      ['easy', 15],
      ['average', 30],
      ['difficult', 45],
      ['pro', 60],
    ].map(([labelId, value]) => [
      labelId + '-difficulty',
      (state.daysInterval || 0) * (value as number),
    ]),
    type: [
      ['speak', 'speak'],
      ['listen', 'listen'],
      ['both-speak-and-listen', 'both'],
    ],
  };

  async function handleNext(confirmed = false) {
    const nextIndex = (stepIndex + 1) % steps.length;
    if (customGoal && !confirmed && nextIndex == STEPS.EDIT_START) {
      setShowOverwriteModal(true);
      return;
    }
    setStepIndex(nextIndex);
    setTouchedStepIndex(Math.max(touchedStepIndex, nextIndex));
    if (nextIndex == STEPS.COMPLETED) {
      setTouchedStepIndex(STEPS.INTRO);
      await api.createGoal(dashboardLocale, state);
      if (!account.languages.some(l => l.locale == dashboardLocale)) {
        await saveAccount({
          ...account,
          languages: account.languages.concat({
            locale: dashboardLocale,
          }),
        });
      }
      if (subscribed) {
        await api.subscribeToNewsletter(email);
      }
      refreshUser();
    }
  }

  const showViewGoal = stepIndex == STEPS.INTRO && customGoal;
  return (
    <div className={'custom-goal ' + (showViewGoal ? '' : 'step-' + stepIndex)}>
      {showOverwriteModal && (
        <Modal
          buttons={{
            Cancel: () => setShowOverwriteModal(false),
            Yes: () => {
              setShowOverwriteModal(false);
              handleNext(true);
            },
          }}
          onRequestClose={() => setShowOverwriteModal(false)}>
          <Localized id="lose-goal-progress-warning">
            <span />
          </Localized>
          <br />
          <Localized id="want-to-continue">
            <span />
          </Localized>
        </Modal>
      )}
      {showAbortEditModal && (
        <Modal
          buttons={{
            Exit: () => setShowAbortEditModal(false),
            Yes: () => {
              setShowAbortEditModal(false);
              setState(initialState);
              setTouchedStepIndex(STEPS.INTRO);
              setStepIndex(STEPS.INTRO);
            },
          }}
          onRequestClose={() => setShowAbortEditModal(false)}>
          <Localized id="finish-editing">
            <span />
          </Localized>
          <br />
          <Localized id="lose-changes-warning">
            <span />
          </Localized>
        </Modal>
      )}
      <StepButtons
        setStepIndex={i => {
          setTouchedStepIndex(Math.max(touchedStepIndex, i));
          setStepIndex(i);
        }}
        {...{ state, stepIndex, touchedStepIndex }}
      />
      {showViewGoal ? (
        <ViewGoal
          locale={dashboardLocale}
          onNext={() => handleNext()}
          customGoal={customGoal}
        />
      ) : (
        <Step
          closeButtonProps={{
            onClick: () => {
              setShowAbortEditModal(true);
            },
            style: customGoal ? {} : { visibility: 'hidden' },
          }}
          completedFields={
            <CompletedFields {...{ setStepIndex, state, states, stepIndex }} />
          }
          currentFields={
            <CurrentFields {...{ setState, state, states, stepIndex }} />
          }
          nextButtonProps={{
            disabled:
              stepIndex > STEPS.INTRO &&
              stepIndex < STEPS.SUBMIT &&
              state[STATE_KEYS[stepIndex]] == null,
            onClick: () => handleNext(),
          }}
          state={state}
          {...{ dashboardLocale, subscribed, setSubscribed }}
        />
      )}
    </div>
  );
}
