import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { CustomGoal, CustomGoalParams } from 'common/goals';
import URLS from '../../../../urls';
import { LocaleLink } from '../../../locale-helpers';
import ShareModal from '../../../share-modal/share-modal';
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

const CloseButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button type="button" className="close-button" {...props}>
    <CrossIcon />
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
  ({ nextButtonProps }) => (
    <>
      <h1>Build a custom goal</h1>
      <span className="sub-head">and help us reach 10k hours in English</span>

      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
      </div>

      <div className="padded">
        <Button className="get-started-button" rounded {...nextButtonProps}>
          Get Started
        </Button>
      </div>
    </>
  ),

  ({ closeButtonProps, currentRadios, nextButtonProps }) => (
    <>
      <div className="padded">
        <h2>What kind of goal do you want to build?</h2>
        {currentRadios}
      </div>
      <div className="buttons" style={{ marginBottom: 20 }}>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </div>
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

  ({
    closeButtonProps,
    completedRadios,
    currentRadios,
    nextButtonProps,
    state,
  }) => (
    <>
      <div className="padded">
        {completedRadios}
        <h2>
          Great! How many clips
          {state.daysInterval == 7 ? ' a week' : ' per day'}?
        </h2>
        {currentRadios}
      </div>
      <div className="buttons">
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </div>
    </>
  ),

  ({ closeButtonProps, completedRadios, currentRadios, nextButtonProps }) => (
    <>
      <div className="padded">
        {completedRadios}
        <h2>Do you want to Speak, Listen or both?</h2>
        {currentRadios}
      </div>
      <div className="buttons">
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </div>
    </>
  ),

  ({ closeButtonProps, completedRadios, nextButtonProps }) => (
    <div className="padded">
      {completedRadios}
      <label className="box">
        <input type="checkbox" />
        <div className="content">
          I’d like updates and goal reminders to keep current with Common Voice
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
      <div className="buttons">
        <CloseButton {...closeButtonProps} />
        <Button rounded className="submit" {...nextButtonProps}>
          <CheckIcon /> Confirm Goal
        </Button>
      </div>
    </div>
  ),

  ({ nextButtonProps }) => {
    const [showShareModal, setShowShareModal] = useState(false);
    return (
      <div className="padded">
        {showShareModal && (
          <ShareModal
            title={
              <>
                <b>Help us</b> Find more voices, share your goal
              </>
            }
            text="Share your 105 Clip Weekly Goal for Speaking and Listening"
            onRequestClose={() => setShowShareModal(false)}
          />
        )}
        <div className="check">
          <div className="shadow" />
          <CheckIcon />
        </div>
        <h2>Your weekly goal has been created</h2>
        <p>
          Track progress here and on your stats page.
          <br />
          Return here to edit your goal anytime.
        </p>
        <Button
          rounded
          className="share-button"
          onClick={() => setShowShareModal(true)}>
          <ShareIcon /> Share my goal
        </Button>
        <CloseButton {...nextButtonProps} />
      </div>
    );
  },
] as (React.ComponentType<{
  closeButtonProps: React.HTMLProps<HTMLButtonElement>;
  completedRadios: React.ReactNode;
  currentRadios: React.ReactNode;
  nextButtonProps: React.HTMLProps<HTMLButtonElement>;
  state: State;
}>)[];
