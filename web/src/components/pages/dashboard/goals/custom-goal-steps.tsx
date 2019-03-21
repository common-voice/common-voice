import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { CustomGoal, CustomGoalParams } from 'common/goals';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import {
  ArrowLeft,
  CheckIcon,
  CrossIcon,
  PenIcon,
  ShareIcon,
} from '../../../ui/icons';
import { Button, LinkButton } from '../../../ui/ui';
import { CircleProgress, Fraction } from '../ui';

export type State = CustomGoalParams & {
  remind: boolean;
};

const ArrowButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button className="arrow-button" type="button" {...props}>
    <ArrowLeft />
  </button>
);

export const ViewGoal = ({
  onNext,
  customGoal: { amount, current, days_interval },
}: {
  onNext: () => any;
  customGoal: CustomGoal;
}) => (
  <div className="padded view-goal">
    <div className="top">
      <h2>Custom Goals</h2>
      <button className="edit-button" type="button" onClick={onNext}>
        <PenIcon />
      </button>
    </div>
    {Object.keys(current).map(key => {
      const value = (current as any)[key];
      return (
        <div key={key} className={'goal-box ' + key}>
          <Fraction numerator={value} denominator={amount} />

          <div className="relative">
            <CircleProgress value={value / amount} />
            <div className="interval">
              {days_interval == 7 ? 'Of weekly goal' : 'Of daily goal'}
            </div>
          </div>

          <LinkButton
            className="cta"
            rounded
            absolute
            to={'/en' + (key == 'speak' ? URLS.SPEAK : URLS.LISTEN)}>
            {key[0].toUpperCase() + key.slice(1)}
          </LinkButton>
        </div>
      );
    })}
  </div>
);

export default [
  ({ buttonProps }) => (
    <>
      <h1>Build a custom goal</h1>
      <span className="sub-head">and help us reach 10k hours in English</span>

      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
      </div>

      <div className="padded">
        <Button className="get-started-button" rounded {...buttonProps}>
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

  ({ buttonProps, completedRadios }) => (
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
      <Button rounded className="submit" {...buttonProps}>
        <CheckIcon /> Confirm Goal
      </Button>
    </div>
  ),

  ({ buttonProps }) => (
    <div className="padded">
      <div className="check">
        <div className="shadow" />
        <CheckIcon />
      </div>
      <h2>Your weekly goal has  been created</h2>
      <p>
        Track progress here and on your stats page.
        <br />
        Return here to edit your goal anytime.
      </p>
      <Button rounded className="share-button">
        <ShareIcon /> Share my goal
      </Button>
      <button type="button" className="close-button" {...buttonProps}>
        <CrossIcon />
      </button>
    </div>
  ),
] as (React.ComponentType<{
  buttonProps: React.HTMLProps<HTMLButtonElement>;
  completedRadios: React.ReactNode;
  currentRadios: React.ReactNode;
  state: State;
}>)[];
