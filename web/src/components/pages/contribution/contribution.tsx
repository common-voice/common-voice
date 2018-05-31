import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
const { Tooltip } = require('react-tippy');
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import { ArrowLeft, CheckIcon, SkipIcon } from '../../ui/icons';
import { Button } from '../../ui/ui';
import Success from './success';

import './contribution.css';

export const SET_COUNT = 5;

export interface ContributionPillProps {
  isOpen: boolean;
  key: any;
  num: number;
  onClick: () => any;
  style?: any;
}

interface Props extends LocalizationProps {
  activeIndex: number;
  errorContent?: any;
  extraButton?: React.ReactNode;
  instruction: (
    props: { $actionType: string; children: any }
  ) => React.ReactNode;
  isFirstSubmit?: boolean;
  isSubmitted: boolean;
  onReset: () => any;
  onSkip: () => any;
  onSubmit?: () => any;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  sentences: string[];
  type: 'speak' | 'listen';
}

interface State {
  selectedPill: number;
}

class ContributionPage extends React.Component<Props, State> {
  static defaultProps = {
    isFirstSubmit: false,
  };

  state: State = { selectedPill: null };

  private get isLoaded() {
    return this.props.sentences.length > 0;
  }

  private get isDone() {
    return this.isLoaded && this.props.activeIndex === -1;
  }

  private selectPill(i: number) {
    this.setState({ selectedPill: i });
  }

  render() {
    const { errorContent, isSubmitted, type } = this.props;

    return (
      <div
        className="contribution-wrapper"
        onClick={() => this.selectPill(null)}>
        <div
          className={[
            'contribution',
            type,
            this.isDone ? 'submittable' : '',
          ].join(' ')}>
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

            {this.isLoaded &&
              !errorContent && (
                <div className={'counter ' + (isSubmitted ? 'done' : '')}>
                  {isSubmitted && <CheckIcon />}
                  {this.renderCounter()}
                  <Localized id="clips">
                    <span className="text" />
                  </Localized>
                </div>
              )}
          </div>

          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderCounter() {
    return (this.props.activeIndex + 1 || SET_COUNT) + '/' + SET_COUNT;
  }

  renderContent() {
    const {
      activeIndex,
      errorContent,
      extraButton,
      getString,
      instruction,
      isFirstSubmit,
      isSubmitted,
      onReset,
      onSkip,
      onSubmit,
      pills,
      primaryButtons,
      sentences,
      type,
    } = this.props;
    const { selectedPill } = this.state;

    return isSubmitted ? (
      <Success onReset={onReset} type={type} />
    ) : (
      errorContent ||
        (this.isLoaded && (
          <React.Fragment>
            <div className="cards-and-pills">
              <div />

              <div className="cards-and-instruction">
                {instruction({
                  $actionType: getString('action-click'),
                  children: <div className="instruction hidden-sm-down" />,
                }) || <div className="instruction hidden-sm-down" />}

                <div className="cards">
                  {sentences.map((sentence, i) => {
                    const activeSentenceIndex = this.isDone
                      ? SET_COUNT - 1
                      : activeIndex;
                    const isActive = i === activeSentenceIndex;
                    return (
                      <div
                        key={sentence}
                        className={'card ' + (isActive ? '' : 'inactive')}
                        style={{
                          transform: [
                            `scale(${isActive ? 1 : 0.9})`,
                            `translateX(${(i - activeSentenceIndex) * -120}%)`,
                          ].join(' '),
                          opacity: i < activeSentenceIndex ? 0 : 1,
                        }}>
                        <div style={{ margin: 'auto', width: '100%' }}>
                          {sentence}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pills">
                <div className="inner">
                  {!errorContent && (
                    <div className="counter">
                      {this.renderCounter()}
                      <Localized id="clips">
                        <span className="text" />
                      </Localized>
                    </div>
                  )}
                  {this.isDone && (
                    <div className="review-instructions">
                      <Localized id="review-instruction">
                        <span />
                      </Localized>
                    </div>
                  )}
                  {pills.map((pill, i) =>
                    pill({
                      isOpen: this.isDone || selectedPill === i,
                      key: i,
                      num: i + 1,
                      onClick: () => this.selectPill(i),
                      style:
                        selectedPill !== null &&
                        Math.abs(
                          Math.min(
                            Math.max(selectedPill, 1),
                            pills.length - 2
                          ) - i
                        ) > 1
                          ? { display: 'none' }
                          : {},
                    })
                  )}
                </div>
              </div>
            </div>

            {instruction({
              $actionType: getString('action-tap'),
              children: <div className="instruction hidden-md-up" />,
            })}

            <div className="primary-buttons">{primaryButtons}</div>

            <div className="buttons">
              <div>
                <Localized id="shortcuts">
                  <Button rounded outline className="hidden-sm-down" />
                </Localized>
                <div className="extra-button">{extraButton}</div>
              </div>
              <div>
                <Button
                  rounded
                  outline
                  className="skip"
                  disabled={!this.isLoaded}
                  onClick={onSkip}>
                  <Localized id="skip">
                    <span />
                  </Localized>{' '}
                  <SkipIcon />
                </Button>
                {onSubmit && (
                  <Tooltip
                    arrow
                    disabled={!this.isDone}
                    open={isFirstSubmit || undefined}
                    title={getString('record-submit-tooltip', {
                      actionType: getString('action-tap'),
                    })}>
                    <Localized id="submit-form-action">
                      <Button
                        rounded
                        outline
                        disabled={!this.isDone}
                        className="hidden-sm-down"
                        onClick={onSubmit}
                        type="submit"
                      />
                    </Localized>
                  </Tooltip>
                )}
              </div>
            </div>
          </React.Fragment>
        ))
    );
  }
}

export default withLocalization(ContributionPage);
