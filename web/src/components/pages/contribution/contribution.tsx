import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
const { Tooltip } = require('react-tippy');
import { Flags } from '../../../stores/flags';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { Sentence } from 'common';
import {
  trackListening,
  trackProfile,
  trackRecording,
  getTrackClass,
} from '../../../services/tracker';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink, useLocale } from '../../locale-helpers';
import Modal, { ModalProps } from '../../modal/modal';
import {
  ArrowLeft,
  CheckIcon,
  KeyboardIcon,
  ShareIcon,
  SkipIcon,
  ExternalLinkIcon,
} from '../../ui/icons';
import { Button, StyledLink, LinkButton } from '../../ui/ui';
import { PrimaryButton } from '../../primary-buttons/primary-buttons';
import ShareModal from '../../share-modal/share-modal';
import { ReportButton, ReportModal, ReportModalProps } from './report/report';
import Success from './success';
import Wave from './wave';

import './contribution.css';

const HAS_SEEN_ACCOUNT_MODAL_KEY = 'hasSeenAccountModal2';

const AccountModal = (props: ModalProps) => {
  const [locale] = useLocale();
  return (
    <Modal {...props} innerClassName="account-modal">
      <div className="images">
        <img src={require('./waves.svg')} alt="Waves" className="bg" />
        <img
          src={require('./mars-blue.svg')}
          alt="Mars Robot"
          className="mars"
        />
      </div>
      <Localized id="keep-track-profile">
        <h1 />
      </Localized>
      <Localized id="login-to-get-started">
        <h2 />
      </Localized>
      <Localized id="login-signup">
        <LinkButton
          rounded
          href="/login"
          onClick={() => {
            sessionStorage.setItem('redirectURL', location.pathname);
            trackProfile('contribution-conversion-modal', locale);
          }}
        />
      </Localized>
    </Modal>
  );
};

export const SET_COUNT = 5;

export interface ContributionPillProps {
  isOpen: boolean;
  key: any;
  num: number;
  onClick: () => any;
  onShare: () => any;
  style?: any;
}

interface PropsFromState {
  flags: Flags.State;
  locale: Locale.State;
  user: User.State;
}

interface Props extends LocalizationProps, PropsFromState {
  activeIndex: number;
  errorContent?: any;
  reportModalProps: Omit<ReportModalProps, 'onSubmitted'>;
  instruction: (props: {
    $actionType: string;
    children: any;
  }) => React.ReactNode;
  isFirstSubmit?: boolean;
  isPlaying: boolean;
  isSubmitted: boolean;
  onReset: () => any;
  onSkip: () => any;
  onSubmit?: () => any;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  sentences: Sentence[];
  shortcuts: {
    key: string;
    label: string;
    action: () => any;
  }[];
  type: 'speak' | 'listen';
}

interface State {
  selectedPill: number;
  showAccountModal: boolean;
  showReportModal: boolean;
  showShareModal: boolean;
  showShortcutsModal: boolean;
}

class ContributionPage extends React.Component<Props, State> {
  static defaultProps = {
    isFirstSubmit: false,
  };

  state: State = {
    selectedPill: null,
    showAccountModal: false,
    showReportModal: false,
    showShareModal: false,
    showShortcutsModal: false,
  };

  private canvasRef: { current: HTMLCanvasElement | null } = React.createRef();
  private wave: Wave;

  private get showAccountModalDefault() {
    const { flags, user } = this.props;
    return (
      flags.showAccountConversionModal &&
      !user.account &&
      !JSON.parse(localStorage.getItem(HAS_SEEN_ACCOUNT_MODAL_KEY))
    );
  }

  componentDidMount() {
    this.startWaving();
    window.addEventListener('keydown', this.handleKeyDown);

    // preload account modal images to prevent layout shifting
    if (this.showAccountModalDefault) {
      new Image().src = require('./waves.svg');
      new Image().src = require('./mars-blue.svg');
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.startWaving();

    const { activeIndex, isPlaying, isSubmitted, onReset, user } = this.props;

    if (activeIndex == 1 && prevProps.activeIndex != activeIndex) {
      const showAccountModal = this.showAccountModalDefault;
      this.setState({ showAccountModal });
      if (showAccountModal) {
        localStorage.setItem(HAS_SEEN_ACCOUNT_MODAL_KEY, JSON.stringify(true));
      }
    }

    if (this.wave) {
      isPlaying ? this.wave.play() : this.wave.idle();
    }

    if (isSubmitted && user.account?.skip_submission_feedback) {
      onReset();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.wave) this.wave.idle();
  }

  private get isLoaded() {
    return this.props.sentences.length > 0;
  }

  private get isDone() {
    return this.isLoaded && this.props.activeIndex === -1;
  }

  private get shortcuts() {
    const { onSkip, shortcuts } = this.props;
    return shortcuts.concat({
      key: 'shortcut-skip',
      label: 'skip',
      action: onSkip,
    });
  }

  private startWaving = () => {
    const canvas = this.canvasRef.current;

    if (this.wave) {
      if (!canvas) {
        this.wave.idle();
        this.wave = null;
      }
      return;
    }

    if (canvas) {
      this.wave = new Wave(canvas);
    }
  };

  private selectPill(i: number) {
    this.setState({ selectedPill: i });
  }

  private toggleShareModal = () =>
    this.setState({ showShareModal: !this.state.showShareModal });

  private toggleShortcutsModal = () => {
    const showShortcutsModal = !this.state.showShortcutsModal;
    if (showShortcutsModal) {
      const { locale, type } = this.props;
      (type == 'listen' ? trackListening : (trackRecording as any))(
        'view-shortcuts',
        locale
      );
    }
    return this.setState({ showShortcutsModal });
  };

  private handleKeyDown = (event: any) => {
    const {
      getString,
      isSubmitted,
      locale,
      onReset,
      onSubmit,
      type,
    } = this.props;

    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      this.state.showReportModal
    ) {
      return;
    }

    const isEnter = event.key === 'Enter';
    if (isSubmitted && isEnter) {
      onReset();
      return;
    }
    if (this.isDone) {
      if (isEnter && onSubmit) onSubmit();
      return;
    }

    const shortcut = this.shortcuts.find(
      ({ key }) => getString(key).toLowerCase() === event.key
    );
    if (!shortcut) return;

    shortcut.action();
    ((type === 'listen' ? trackListening : trackRecording) as any)(
      'shortcut',
      locale
    );
    event.preventDefault();
  };

  render() {
    const {
      errorContent,
      flags,
      getString,
      isSubmitted,
      onSkip,
      reportModalProps,
      type,
      user,
    } = this.props;
    const {
      showAccountModal,
      showReportModal,
      showShareModal,
      showShortcutsModal,
    } = this.state;

    return (
      <div
        className="contribution-wrapper"
        onClick={() => this.selectPill(null)}>
        {showShareModal && (
          <ShareModal onRequestClose={this.toggleShareModal} />
        )}
        {showShortcutsModal && (
          <Modal
            innerClassName="shortcuts-modal"
            onRequestClose={this.toggleShortcutsModal}>
            <Localized id="shortcuts">
              <h1 />
            </Localized>
            <div className="shortcuts">
              {this.shortcuts.map(({ key, label }) => (
                <div key={key} className="shortcut">
                  <kbd>{getString(key).toUpperCase()}</kbd>
                  <div className="label">{getString(label)}</div>
                </div>
              ))}
            </div>
          </Modal>
        )}
        {showReportModal && (
          <ReportModal
            onRequestClose={() => this.setState({ showReportModal: false })}
            onSubmitted={onSkip}
            {...reportModalProps}
          />
        )}
        {showAccountModal && (
          <AccountModal
            onRequestClose={() => this.setState({ showAccountModal: false })}
          />
        )}
        <div
          className={[
            'contribution',
            type,
            this.isDone ? 'submittable' : '',
          ].join(' ')}>
          <div className="top">
            <LocaleLink
              to={user.account ? URLS.DASHBOARD : URLS.ROOT}
              className="back">
              <ArrowLeft />
            </LocaleLink>

            <div className="links">
              <Localized id="speak">
                <LocaleNavLink
                  className={getTrackClass('fs', `toggle-speak`)}
                  to={URLS.SPEAK}
                />
              </Localized>
              <Localized id="listen">
                <LocaleNavLink
                  className={getTrackClass('fs', `toggle-listen`)}
                  to={URLS.LISTEN}
                />
              </Localized>
            </div>

            {this.isLoaded && !errorContent ? (
              <div className={'counter ' + (isSubmitted ? 'done' : '')}>
                {isSubmitted && <CheckIcon />}
                <Localized
                  id="clips-with-count"
                  bold={<b />}
                  $count={this.renderClipCount()}>
                  <span className="text" />
                </Localized>
              </div>
            ) : (
              <div />
            )}
            {isSubmitted && (
              <Tooltip arrow title={getString('share-common-voice')}>
                <button className="open-share" onClick={this.toggleShareModal}>
                  <ShareIcon />
                </button>
              </Tooltip>
            )}
          </div>

          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderClipCount() {
    const { activeIndex, isSubmitted } = this.props;
    return (
      (isSubmitted ? SET_COUNT : activeIndex + 1 || SET_COUNT) + '/' + SET_COUNT
    );
  }

  renderContent() {
    const {
      activeIndex,
      errorContent,
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
          <>
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
                        key={i}
                        className={
                          'card card-dimensions ' + (isActive ? '' : 'inactive')
                        }
                        style={{
                          transform: [
                            `scale(${isActive ? 1 : 0.9})`,
                            `translateX(${
                              (document.dir == 'rtl' ? -1 : 1) *
                              (i - activeSentenceIndex) *
                              -130
                            }%)`,
                          ].join(' '),
                          opacity: i < activeSentenceIndex ? 0 : 1,
                        }}>
                        <div style={{ margin: 'auto', width: '100%' }}>
                          {sentence.text}
                          {sentence.taxonomy ? (
                            <div className="sentence-taxonomy">
                              <Localized id="target-segment-first-card">
                                <div />
                              </Localized>
                              <StyledLink
                                className="taxonomy-link"
                                blank
                                href={URLS.TARGET_SEGMENT_INFO}>
                                <ExternalLinkIcon />
                                <Localized id="target-segment-learn-more">
                                  <div />
                                </Localized>
                              </StyledLink>
                            </div>
                          ) : null}
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
                      <Localized
                        id="clips-with-count"
                        bold={<b />}
                        $count={this.renderClipCount()}>
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
                      onShare: this.toggleShareModal,
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
            }) || <div className="instruction hidden-md-up" />}

            <div className="primary-buttons">
              <canvas ref={this.canvasRef} />
              {primaryButtons}
            </div>

            <div className="buttons">
              <div>
                <Button
                  rounded
                  outline
                  className="hidden-sm-down"
                  onClick={this.toggleShortcutsModal}>
                  <KeyboardIcon />
                  <Localized id="shortcuts">
                    <span />
                  </Localized>
                </Button>
                <div className="extra-button">
                  <ReportButton
                    onClick={() => this.setState({ showReportModal: true })}
                  />
                </div>
              </div>
              <div>
                <Button
                  rounded
                  outline
                  className={[
                    'skip',
                    getTrackClass('fs', `skip-${type}`),
                    'fs-ignore-rage-clicks',
                  ].join(' ')}
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
                      <PrimaryButton
                        className={[
                          'submit',
                          getTrackClass('fs', `submit-${type}`),
                        ].join(' ')}
                        disabled={!this.isDone}
                        onClick={onSubmit}
                        type="submit"
                      />
                    </Localized>
                  </Tooltip>
                )}
              </div>
            </div>
          </>
        ))
    );
  }
}

export default connect<PropsFromState>(
  ({ flags, locale, user }: StateTree) => ({
    flags,
    locale,
    user,
  })
)(withLocalization(ContributionPage));
