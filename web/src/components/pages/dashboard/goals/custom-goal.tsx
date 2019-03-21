import * as React from 'react';
import { useState } from 'react';
import { CustomGoal, CustomGoalParams } from 'common/goals';
import { PenIcon } from '../../../ui/icons';
import steps, { State, ViewGoal } from './custom-goal-steps';

import './custom-goal.css';

const STATE_KEYS: ReadonlyArray<keyof State> = [
  null, // first step has no state
  'daysInterval',
  'amount',
  'type',
];

const Radio = ({
  children,
  onChecked,
  ...props
}: {
  children: React.ReactNode;
  onChecked?: () => any;
} & React.HTMLProps<HTMLInputElement>) => (
  <label className="box">
    <input
      type="radio"
      onChange={event => event.target.checked && onChecked && onChecked()}
      {...props}
    />
    <div className="content">{children}</div>
  </label>
);

function StepButtons({
  setStepIndex,
  state,
  stepIndex,
}: {
  setStepIndex: (index: number) => void;
  state: State;
  stepIndex: number;
}) {
  return (
    <div className="padded step-buttons">
      {stepIndex > 0 &&
        stepIndex < 5 &&
        [...(Array(4) as any).keys()].map(i => {
          const n = i + 1;
          const hasValue = state[STATE_KEYS[n]] != null;
          const isActive = n == stepIndex;
          return (
            <React.Fragment key={i}>
              <div
                className={[
                  'step-button',
                  isActive ? 'active' : '',
                  hasValue ? 'completed' : '',
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
                    className={'line ' + (hasValue || isActive ? 'fill' : '')}
                  />
                  <div className={'line ' + (hasValue ? 'fill' : '')} />
                </>
              )}
            </React.Fragment>
          );
        })}
    </div>
  );
}

function CompletedRadios({
  setStepIndex,
  state,
  states,
  stepIndex,
}: {
  setStepIndex: (index: number) => void;
  state: State;
  states: any;
  stepIndex: number;
}) {
  const completedStates = stepIndex > 4 ? [] : STATE_KEYS.slice(1, stepIndex);
  return (
    <div className="fields completed">
      {completedStates.map(stateKey => {
        if (!states[stateKey]) return null;
        const [label, value] = states[stateKey].find(
          ([label, value]: any) => value == state[stateKey]
        );
        return (
          <Radio key={stateKey} checked disabled>
            {({
              amount: value + ' clips',
              type: value == 'both' ? 'Both (Speak and Listen)' : label,
            } as any)[stateKey] || label}
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

function CurrentRadios({
  setState,
  state,
  states,
  stepIndex,
}: {
  setState: (state: State) => void;
  state: State;
  states: any;
  stepIndex: number;
}) {
  const currentStateKey = STATE_KEYS[stepIndex];
  return (
    <div className="fields">
      {(states[currentStateKey] || []).map(([label, value]: any) =>
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
            }>
            {({
              amount: (
                <>
                  {value + ' clips'}
                  <span className="right">{label}</span>
                </>
              ),
            } as any)[currentStateKey] || label}
          </Radio>
        )
      )}
    </div>
  );
}

export default function CustomGoal({
  customGoal,
  saveCustomGoal,
}: {
  customGoal?: CustomGoal;
  saveCustomGoal: (data: CustomGoalParams) => any;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<State>({
    ...(customGoal
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
        }),
    remind: false,
  });

  const Step = steps[stepIndex];

  const states: any = {
    daysInterval: [['Daily Goal', 1], ['Weekly Goal', 7]],
    amount: [['Easy', 5], ['Average', 10], ['Difficult', 15], ['Pro', 20]].map(
      ([label, value]) => [label, (state.daysInterval || 0) * (value as number)]
    ),
    type: [['Speak', 'speak'], ['Listen', 'listen'], ['Both', 'both']],
  };

  function handleNext() {
    const nextIndex = (stepIndex + 1) % steps.length;
    setStepIndex(nextIndex);
    if (nextIndex == 5) {
      saveCustomGoal(state);
    }
  }

  const showViewGoal = stepIndex == 0 && customGoal;
  return (
    <div className={'custom-goal ' + (showViewGoal ? '' : 'step-' + stepIndex)}>
      <StepButtons {...{ setStepIndex, state, stepIndex }} />
      {showViewGoal ? (
        <ViewGoal onNext={handleNext} customGoal={customGoal} />
      ) : (
        <Step
          buttonProps={{
            disabled:
              stepIndex > 0 &&
              stepIndex < 4 &&
              state[STATE_KEYS[stepIndex]] == null,
            onClick: handleNext,
          }}
          completedRadios={
            <CompletedRadios {...{ setStepIndex, state, states, stepIndex }} />
          }
          currentRadios={
            <CurrentRadios {...{ setState, state, states, stepIndex }} />
          }
          state={state}
        />
      )}
    </div>
  );
}
