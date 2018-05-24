import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import {
  ArrowLeft,
  PlayIcon,
  RedoIcon,
  ShareIcon,
  SkipIcon,
} from '../../ui/icons';

import './contribution.css';
import { Button, TextButton } from '../../ui/ui';

export const SET_COUNT = 5;

const ClipPill = ({
  isOpen,
  num,
  status,
}: {
  isOpen: boolean;
  num: number;
  status: 'active' | 'done' | 'pending';
}) => (
  <div className={['pill', isOpen ? 'open' : 'closed', status].join(' ')}>
    <div className="contents">
      {status === 'active' && (
        <Localized id="record-cta">
          <div className="text" />
        </Localized>
      )}
      {status === 'done' && (
        <React.Fragment>
          <button type="button">
            <PlayIcon />
          </button>
          <button type="button">
            <RedoIcon />
          </button>
          <button type="button">
            <ShareIcon />
          </button>
        </React.Fragment>
      )}
    </div>
    <div className="num">{num}</div>
  </div>
);

export default withLocalization(
  ({
    activeIndex,
    className,
    errorContent,
    getString,
    Instruction,
    onSkip,
    onSubmit,
    primaryButtons,
    sentences,
  }: LocalizationProps & {
    activeIndex: number;
    className: string;
    errorContent?: any;
    Instruction: React.StatelessComponent<{ $actionType: string }>;
    onSkip: () => any;
    onSubmit: () => any;
    primaryButtons: React.ReactNode;
    sentences: string[];
  }) => {
    const isDisabled = sentences.length === 0;
    const isDone = activeIndex === -1;

    return (
      <div className="contribution-wrapper">
        <div className={'contribution ' + className}>
          <div className="top">
            <LocaleLink to={URLS.ROOT} className="back">
              <ArrowLeft />
            </LocaleLink>

            <div className="links">
              <Localized id="speak">
                <LocaleNavLink to={URLS.SPEAK} />
              </Localized>
              <Localized id="listen">
                <LocaleNavLink to={URLS.LISTEN} />
              </Localized>
            </div>

            {!errorContent && (
              <div className="counter">
                {activeIndex + 1 || SET_COUNT}/{SET_COUNT}{' '}
                <Localized id="clips">
                  <span className="text" />
                </Localized>
              </div>
            )}
          </div>

          {errorContent || (
            <React.Fragment>
              <div className="cards-and-pills">
                <div />

                <div className="cards-and-instruction">
                  <Instruction $actionType={getString('action-click')}>
                    <div className="instruction hidden-md-down" />
                  </Instruction>

                  <div className="cards">
                    {sentences.map((s, i) => {
                      const activeSentenceIndex = isDone
                        ? SET_COUNT - 1
                        : activeIndex;
                      const isActive = i === activeSentenceIndex;
                      return (
                        <div
                          key={s}
                          className={'card ' + (isActive ? '' : 'inactive')}
                          style={{
                            transform: [
                              `scale(${isActive ? 1 : 0.9})`,
                              `translateX(${(i - activeSentenceIndex) *
                                -120}%)`,
                            ].join(' '),
                            opacity: i < activeSentenceIndex ? 0 : 1,
                          }}>
                          {s}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pills">
                  {sentences.map((s, i) => (
                    <ClipPill
                      key={i}
                      isOpen={false}
                      num={i + 1}
                      status={
                        isDone || i < activeIndex
                          ? 'done'
                          : i === activeIndex ? 'active' : 'pending'
                      }
                    />
                  ))}
                </div>
              </div>

              <Instruction $actionType={getString('action-tap')}>
                <div className="instruction hidden-lg-up" />
              </Instruction>

              <div className="primary-buttons">{primaryButtons}</div>

              <div className="buttons">
                <div>
                  <Localized id="shortcuts">
                    <Button rounded outline className="hidden-md-down" />
                  </Localized>
                  <Localized id="unable-speak">
                    <TextButton />
                  </Localized>
                </div>
                <div>
                  <Button
                    rounded
                    outline
                    className="skip"
                    disabled={isDisabled}
                    onClick={onSkip}>
                    <Localized id="skip">
                      <span />
                    </Localized>{' '}
                    <SkipIcon />
                  </Button>
                  {onSubmit && (
                    <Localized id="submit-form-action">
                      <Button
                        rounded
                        outline
                        disabled={!isDone}
                        className="hidden-md-down"
                        onClick={onSubmit}
                      />
                    </Localized>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
);
