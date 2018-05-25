import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import { ArrowLeft, SkipIcon } from '../../ui/icons';
import { Button } from '../../ui/ui';

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
  className: string;
  errorContent?: any;
  extraButton: React.ReactNode;
  instruction: (
    props: { $actionType: string; children: any }
  ) => React.ReactNode;
  onSkip: () => any;
  onSubmit: () => any;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  sentences: string[];
}

interface State {
  selectedPill: number;
}

class ContributionPage extends React.Component<Props, State> {
  state: State = { selectedPill: null };

  selectPill(i: number) {
    this.setState({ selectedPill: i });
  }

  render() {
    const {
      activeIndex,
      className,
      errorContent,
      extraButton,
      getString,
      instruction,
      onSkip,
      onSubmit,
      pills,
      primaryButtons,
      sentences,
    } = this.props;
    const { selectedPill } = this.state;

    const isLoaded = sentences.length > 0;
    const isDone = isLoaded && activeIndex === -1;

    return (
      <div
        className="contribution-wrapper"
        onClick={() => this.selectPill(null)}>
        <div
          className={[
            'contribution',
            className,
            isDone ? 'submittable' : '',
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
                  {instruction({
                    $actionType: getString('action-click'),
                    children: <div className="instruction hidden-sm-down" />,
                  })}

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
                  {pills.map((pill, i) =>
                    pill({
                      isOpen: isDone || selectedPill === i,
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
                    disabled={!isLoaded}
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
                        className="hidden-sm-down"
                        onClick={onSubmit}
                        type="submit"
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
}

export default withLocalization(ContributionPage);
