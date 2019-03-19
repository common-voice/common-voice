import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import { ArrowLeft, CheckIcon, PenIcon, ShareIcon } from '../../../ui/icons';
import { Button } from '../../../ui/ui';

import './custom-goal.css';

type State = {
  daysInterval: 1 | 7;
  amount: number;
  type: 'speak' | 'listen' | 'both';
  remind: boolean;
};

type StateKey = keyof State;

const STATE_KEYS: ReadonlyArray<StateKey> = [
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

const ArrowButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button className="arrow-button" type="button" {...props}>
    <ArrowLeft />
  </button>
);

const steps: (React.ComponentType<{
  buttonProps: React.HTMLProps<HTMLButtonElement>;
  completedRadios: React.ReactNode;
  currentRadios: React.ReactNode;
  state: State;
}>)[] = [
  ({ buttonProps }) => (
    <>
      <h1>Build a custom goal</h1>
      <span className="sub-head">and help us reach 10k hours in English</span>

      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
      </div>

      <div className="padded">
        <Button rounded {...buttonProps}>
          Get Started
        </Button>
      </div>
    </>
  ),

  ({ buttonProps, currentRadios }) => (
    <>
      <div className="padded">
        <h2>What kind of goal do you want to build?</h2>
        {currentRadios}
      </div>
      <ArrowButton {...buttonProps} style={{ marginBottom: 20 }} />
      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
        <div className="text">
          <h4>Can't decide?</h4>
          <p>
            If just 100 people submitted 15 clips/day or 105 clips/week), we'd
            reach our 10 k hour goal in XX months.
          </p>
        </div>
      </div>
    </>
  ),

  ({ buttonProps, completedRadios, currentRadios, state }) => (
    <>
      <div className="padded">
        {completedRadios}
        <h2>
          Great! How many clips  
          {state.daysInterval == 7 ? ' a week' : ' per day'}?
        </h2>
        {currentRadios}
      </div>
      <ArrowButton {...buttonProps} />
    </>
  ),

  ({ buttonProps, completedRadios, currentRadios }) => (
    <>
      <div className="padded">
        {completedRadios}
        <h2>Do you want to Speak, Listen or both?</h2>
        {currentRadios}
      </div>
      <ArrowButton {...buttonProps} />
    </>
  ),

  ({ completedRadios }) => (
    <div className="padded">
      {completedRadios}
      <label className="box">
        <input type="checkbox" />
        <div className="content">
          Email me personal goal reminders to help me stay on track
        </div>
      </label>
      <Localized
        id="email-opt-in-privacy"
        privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
        <p />
      </Localized>
      <Localized id="read-terms-q">
        <LocaleLink to={URLS.TERMS} className="terms" blank />
      </Localized>
      <Button rounded className="submit">
        <CheckIcon /> Confirm Goal
      </Button>
    </div>
  ),

  () => (
    <div className="padded">
      <div>
        <CheckIcon />
      </div>
      <h2>Your weekly goal has  been created</h2>
      <p>
        Track progress here and on your stats page.
        <br />
        Return here to edit your goal anytime.
      </p>
      <Button rounded>
        <ShareIcon /> Share my goal
      </Button>
    </div>
  ),
];

export default function CustomGoal() {
  const [stepIndex, setStepIndex] = useState(0);
  const [state, setState] = useState<State>({
    daysInterval: null,
    amount: null,
    type: null,
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

  const completedStates = stepIndex > 4 ? [] : STATE_KEYS.slice(1, stepIndex);
  const completedRadios = (
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
  const currentStateKey = STATE_KEYS[stepIndex];
  const currentRadios = (
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

  return (
    <div className={'custom-goal step-' + stepIndex}>
      <div className="padded step-buttons">
        {stepIndex > 0 &&
          [...(Array(4) as any).keys()].map(i => {
            const n = i + 1;
            const hasValue = state[STATE_KEYS[n]] != null;
            const isActive = n == stepIndex;
            return [
              <div
                key={i}
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
              </div>,
              n < 4 && (
                <>
                  <div
                    className={'line ' + (hasValue || isActive ? 'fill' : '')}
                  />
                  <div className={'line ' + (hasValue ? 'fill' : '')} />
                </>
              ),
            ];
          })}
      </div>
      <Step
        {...{ completedRadios, currentRadios, state }}
        buttonProps={{
          disabled: stepIndex > 0 && state[STATE_KEYS[stepIndex]] == null,
          onClick: () => setStepIndex(stepIndex + 1),
        }}
      />
    </div>
  );
}
