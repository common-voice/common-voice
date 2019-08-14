import { Localized, withLocalization } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { CustomGoal, CustomGoalParams } from 'common/goals';
import { UserClient } from 'common/user-clients';
import URLS from '../../../../urls';
import { useAccount, useIsSubscribed } from '../../../../hooks/store-hooks';
import { useRouter } from '../../../../hooks/use-router';
import { getManageSubscriptionURL } from '../../../../utility';
import {
  contributableLocales,
  LocaleLink,
  useLocale,
} from '../../../locale-helpers';
import ShareModal from '../../../share-modal/share-modal';
import {
  ArrowLeft,
  CheckIcon,
  CrossIcon,
  PenIcon,
  SettingsIcon,
  ShareIcon,
} from '../../../ui/icons';
import { Button, LabeledSelect, LinkButton } from '../../../ui/ui';
import { CircleProgress, Fraction } from '../ui';
import { useEffect } from 'react';

const Buttons = ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
  <div className="buttons padded" {...props}>
    {children}
    <div className="filler" />
  </div>
);

const ArrowButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button className="arrow-button" type={'button' as any} {...props}>
    <ArrowLeft />
  </button>
);

const CloseButton = (props: React.HTMLProps<HTMLButtonElement>) => (
  <button type={'button' as any} className="close-button" {...props}>
    <CrossIcon />
  </button>
);

export const ViewGoal = ({
  locale,
  onNext,
  customGoal: { amount, current, days_interval },
}: {
  locale: string;
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
            to={'/' + locale + (key == 'speak' ? URLS.SPEAK : URLS.LISTEN)}>
            {key[0].toUpperCase() + key.slice(1)}
          </LinkButton>
        </div>
      );
    })}
  </div>
);

interface CustomGoalStepProps {
  dashboardLocale: string;

  completedFields: React.ReactNode;
  currentFields: React.ReactNode;

  closeButtonProps: React.HTMLProps<HTMLButtonElement>;
  nextButtonProps: React.HTMLProps<HTMLButtonElement>;

  state: CustomGoalParams;

  subscribed: boolean;
  setSubscribed: (subscribed: boolean) => void;
}

interface AccountProps {
  account: UserClient;
}

export default [
  withLocalization(({ getString, dashboardLocale, nextButtonProps }: any) => {
    const { history } = useRouter();
    const [, toLocaleRoute] = useLocale();
    const [locale, setLocale] = useState('');
    return (
      <>
        <div className="text">
          <Localized id="build-custom-goal">
            <h1 />
          </Localized>
          <Localized
            id={
              dashboardLocale ? 'help-reach-hours' : 'help-reach-hours-general'
            }
            $hours={10000}
            $language={getString(dashboardLocale)}>
            <span className="sub-head" />
          </Localized>
        </div>

        <div className="waves">
          <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
        </div>

        {!dashboardLocale && (
          <div className="select-wrap">
            <Localized
              id="request-language-form-language"
              attrs={{ label: true }}>
              <LabeledSelect
                value={locale}
                onChange={(event: any) => setLocale(event.target.value)}>
                <option key="empty" value="" />
                {contributableLocales.map(l => (
                  <Localized id={l}>
                    <option key={l} value={l} />
                  </Localized>
                ))}
              </LabeledSelect>
            </Localized>
          </div>
        )}

        <Localized id="set-a-goal">
          <Button
            className="get-started-button"
            rounded
            {...nextButtonProps}
            disabled={!dashboardLocale && !locale}
            onClick={
              dashboardLocale
                ? nextButtonProps.onClick
                : () => {
                    history.push(
                      toLocaleRoute(
                        URLS.DASHBOARD + '/' + locale + URLS.GOALS + '?start'
                      )
                    );
                  }
            }
          />
        </Localized>
      </>
    );
  }),

  ({ closeButtonProps, currentFields, nextButtonProps }) => (
    <>
      <div className="padded">
        <h2>What kind of goal do you want to build?</h2>
        {currentFields}
      </div>
      <Buttons style={{ marginBottom: 20 }}>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
      <div className="waves">
        <img className="mars" src="/img/mars.svg" alt="Mars Robot" />
        <div className="text">
          <Localized id="cant-decide">
            <h4 />
          </Localized>
          <Localized
            id="activity-needed-calculation"
            $totalHours={10000}
            $periodMonths={6}
            $people={1000}
            $clipsPerDay={45}>
            <p />
          </Localized>
        </div>
      </div>
    </>
  ),

  ({
    closeButtonProps,
    completedFields,
    currentFields,
    nextButtonProps,
    state,
  }) => (
    <>
      <div className="padded">
        {completedFields}
        <Localized
          id={state.daysInterval == 7 ? 'how-many-a-week' : 'how-many-per-day'}>
          <h2 />
        </Localized>
        {currentFields}
      </div>
      <Buttons>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
    </>
  ),

  ({ closeButtonProps, completedFields, currentFields, nextButtonProps }) => (
    <>
      <div className="padded">
        {completedFields}
        <Localized id="which-goal-type">
          <h2 />
        </Localized>
        {currentFields}
      </div>
      <Buttons>
        <CloseButton {...closeButtonProps} />
        <ArrowButton {...nextButtonProps} />
      </Buttons>
    </>
  ),

  ({
    closeButtonProps,
    completedFields,
    nextButtonProps,

    subscribed,
    setSubscribed,
  }: CustomGoalStepProps & AccountProps) => {
    const account = useAccount();
    const [privacyAgreed, setPrivacyAgreed] = useState(false);
    const isSubscribed = useIsSubscribed();

    return (
      <div className="padded">
        {completedFields}
        {account.basket_token ? (
          isSubscribed !== null && (
            <>
              <Localized
                id={
                  isSubscribed
                    ? 'receiving-emails-info'
                    : 'not-receiving-emails-info'
                }
                bold={<b />}>
                <p className="subscription-info" />
              </Localized>
              <a
                className="manage-subscriptions"
                href={getManageSubscriptionURL(account)}
                target="__blank"
                rel="noopener noreferrer">
                <Localized id="manage-email-subscriptions">
                  <span />
                </Localized>
                <SettingsIcon />
              </a>
            </>
          )
        ) : (
          <>
            <label className="box">
              <input
                type="checkbox"
                checked={subscribed}
                onChange={event => setSubscribed(event.target.checked)}
              />
              <Localized id="email-opt-in-info">
                <div className="content" />
              </Localized>
            </label>
            <label className="box">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={event => setPrivacyAgreed(event.target.checked)}
              />
              <div className="content">
                <Localized
                  id="accept-privacy"
                  privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
                  <span />
                </Localized>
              </div>
            </label>
            <Localized id="read-terms-q">
              <LocaleLink to={URLS.TERMS} className="terms" blank />
            </Localized>
          </>
        )}
        <Buttons>
          <CloseButton {...closeButtonProps} />
          <Button
            rounded
            className="submit"
            {...nextButtonProps}
            disabled={subscribed && !privacyAgreed}>
            <CheckIcon />{' '}
            <Localized id="confirm-goal">
              <span />
            </Localized>
          </Button>
        </Buttons>
      </div>
    );
  },

  withLocalization(({ getString, nextButtonProps, state }: any) => {
    const [showShareModal, setShowShareModal] = useState(false);
    const isWeekly = state.daysInterval == 7;
    return (
      <div className="padded">
        {showShareModal && (
          <ShareModal
            title={getString('help-share-goal')}
            text={getString(
              isWeekly
                ? 'share-n-weekly-contribution-goal'
                : 'share-n-daily-contribution-goal',
              {
                count: state.amount,
                type: getString('share-goal-type-' + state.type),
              }
            )}
            shareTextId="goal-share-text"
            onRequestClose={() => {
              setShowShareModal(false);
              const { onClick } = nextButtonProps as any;
              if (onClick) {
                onClick();
              }
            }}
          />
        )}
        <div className="check">
          <div className="shadow" />
          <CheckIcon />
        </div>
        <Localized id={isWeekly ? 'weekly-goal-created' : 'daily-goal-created'}>
          <h2 />
        </Localized>
        <p>
          <Localized id="track-progress">
            <span />
          </Localized>
          <br />
          <Localized id="return-to-edit-goal">
            <span />
          </Localized>
        </p>
        <Button
          rounded
          className="share-button"
          onClick={() => setShowShareModal(true)}>
          <ShareIcon />{' '}
          <Localized id="share-goal">
            <span />
          </Localized>
        </Button>
        <CloseButton {...nextButtonProps} />
      </div>
    );
  }),
] as (React.ComponentType<CustomGoalStepProps>)[];
