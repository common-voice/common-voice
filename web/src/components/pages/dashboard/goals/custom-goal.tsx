import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { CustomGoalParams } from 'common/goals';
import { UserClient } from 'common/user-clients';
import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import Modal from '../../../modal/modal';
import { PenIcon } from '../../../ui/icons';
import steps, { ViewGoal } from './custom-goal-steps';

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

interface PropsFromState {
  account: UserClient;
  api: API;
}

interface PropsFromDispatch {
  refreshUser: typeof User.actions.refresh;
}

type Props = PropsFromState & PropsFromDispatch;

function CustomGoal({
  account: { customGoal, email },
  api,
  refreshUser,
}: Props) {
  const [stepIndex, setStepIndex] = useState(STEPS.INTRO);
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
    daysInterval: [['Daily Goal', 1], ['Weekly Goal', 7]],
    amount: [['Easy', 15], ['Average', 30], ['Difficult', 45], ['Pro', 60]].map(
      ([label, value]) => [label, (state.daysInterval || 0) * (value as number)]
    ),
    type: [['Speak', 'speak'], ['Listen', 'listen'], ['Both', 'both']],
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
      await api.createGoal(state);
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
          By editing your goal, you may lose your existing progress.
          <br />
          Do you want to continue?
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
          Finish editing first?
          <br />
          Leaving now means you’ll lose your changes
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
        <ViewGoal onNext={() => handleNext()} customGoal={customGoal} />
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
          {...{ subscribed, setSubscribed }}
        />
      )}
    </div>
  );
}

export default connect<PropsFromState, any>(
  ({ api, user }: StateTree) => ({
    account: user.account,
    api,
  }),
  { refreshUser: User.actions.refresh }
)(CustomGoal) as any;
