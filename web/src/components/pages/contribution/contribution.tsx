import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Flags } from '../../../stores/flags';
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { Sentence } from 'common';
import {
  trackListening,
  trackRecording,
  getTrackClass,
} from '../../../services/tracker';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import Modal from '../../modal/modal';
import {
  ArrowLeft,
  KeyboardIcon,
  SkipIcon,
  ExternalLinkIcon,
} from '../../ui/icons';
import { Button, StyledLink, LabeledCheckbox } from '../../ui/ui';
import { PrimaryButton } from '../../primary-buttons/primary-buttons';
import ShareModal from '../../share-modal/share-modal';
import { ReportButton, ReportModal, ReportModalProps } from './report/report';
import Wave from './wave';
import { FirstPostSubmissionCta } from './speak/firstSubmissionCTA/firstPostSubmissionCTA';
import { SecondPostSubmissionCTA } from './speak/secondSubmissionCTA/secondSubmissionCTA';
import { Notifications } from '../../../stores/notifications';

import './contribution.css';

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

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
}

export interface ContributionPageProps
  extends WithLocalizationProps,
    PropsFromState,
    PropsFromDispatch {
  demoMode: boolean;
  activeIndex: number;
  hasErrors: boolean;
  errorContent?: React.ReactNode;
  reportModalProps: Omit<ReportModalProps, 'onSubmitted'>;
  instruction: (props: {
    vars: { actionType: string };
    children: any;
  }) => React.ReactNode;
  isFirstSubmit?: boolean;
  isPlaying: boolean;
  isSubmitted: boolean;
  onReset: () => any;
  onSkip: () => any;
  onSubmit?: (evt?: React.SyntheticEvent) => void;
  onPrivacyAgreedChange?: (privacyAgreed: boolean) => void;
  privacyAgreedChecked?: boolean;
  shouldShowFirstCTA?: boolean;
  shouldShowSecondCTA?: boolean;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  sentences: Sentence[];
  shortcuts: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    action: () => any;
  }[];
  type: 'speak' | 'listen';
}

interface State {
  selectedPill: number;
  showReportModal: boolean;
  showShareModal: boolean;
  showShortcutsModal: boolean;
}

class ContributionPage extends React.Component<ContributionPageProps, State> {
  static defaultProps = {
    isFirstSubmit: false,
  };

  state: State = {
    selectedPill: null,
    showReportModal: false,
    showShareModal: false,
    showShortcutsModal: false,
  };

  private canvasRef: { current: HTMLCanvasElement | null } = React.createRef();
  private wave: Wave;

  componentDidMount() {
    this.startWaving();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    this.startWaving();

    const { isPlaying } = this.props;

    if (this.wave) {
      isPlaying ? this.wave.play() : this.wave.idle();
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
    const { getString, isSubmitted, locale, onReset, onSubmit, type } =
      this.props;

    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      this.state.showReportModal ||
      this.props.shouldShowFirstCTA
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
      hasErrors,
      getString,
      isSubmitted,
      onSkip,
      reportModalProps,
      type,
      user,
      demoMode,
      shouldShowFirstCTA,
      shouldShowSecondCTA,
    } = this.props;
    const { showReportModal, showShareModal, showShortcutsModal } = this.state;

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
              {this.shortcuts.map(({ key, label, icon }) => (
                <div key={key} className="shortcut">
                  <kbd title={getString(key).toUpperCase()}>
                    {icon ? icon : getString(key).toUpperCase()}
                  </kbd>
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
        <div
          className={[
            'contribution',
            type,
            this.isDone ? 'submittable' : '',
            shouldShowFirstCTA ? 'first-cta-visible' : '',
            shouldShowSecondCTA ? 'second-cta-visible' : '',
          ].join(' ')}>
          <div className="top">
            <LocaleLink
              to={
                user.account && !demoMode
                  ? URLS.DASHBOARD
                  : demoMode
                  ? URLS.DEMO_CONTRIBUTE
                  : URLS.ROOT
              }
              className="back">
              <ArrowLeft />
            </LocaleLink>

            <div className="links">
              <Localized id="speak">
                <LocaleNavLink
                  className={getTrackClass('fs', `toggle-speak`)}
                  to={demoMode ? URLS.DEMO_SPEAK : URLS.SPEAK}
                />
              </Localized>
              <Localized id="listen">
                <LocaleNavLink
                  className={getTrackClass('fs', `toggle-listen`)}
                  to={demoMode ? URLS.DEMO_LISTEN : URLS.LISTEN}
                />
              </Localized>
            </div>
            <div className="mobile-break" />

            {!hasErrors && !isSubmitted && (
              <LocaleLink
                blank
                to={URLS.CRITERIA}
                className="contribution-criteria hidden-sm-down">
                <ExternalLinkIcon />
                <Localized id="contribution-criteria-link" />
              </LocaleLink>
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
      hasErrors,
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
      onPrivacyAgreedChange,
      privacyAgreedChecked,
      shouldShowFirstCTA,
      shouldShowSecondCTA,
      user,
    } = this.props;
    const { selectedPill } = this.state;

    const handlePrivacyAgreedChange = (
      evt: React.ChangeEvent<HTMLInputElement>
    ) => {
      onPrivacyAgreedChange(evt.target.checked);
    };

    if (hasErrors) {
      return errorContent;
    }

    if (!this.isLoaded) {
      return null;
    }

    return (
      <>
        <div className="cards-and-pills">
          <div />

          {shouldShowFirstCTA || shouldShowSecondCTA ? (
            <div className="cta-placeholder" />
          ) : (
            <div className="cards-and-instruction">
              {instruction({
                vars: { actionType: getString('action-click') },
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
                      // don't let Chrome auto-translate
                      // https://html.spec.whatwg.org/multipage/dom.html#the-translate-attribute
                      translate="no"
                      key={sentence ? sentence.text : i}
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
                        {sentence?.text}
                        {sentence?.taxonomy ? (
                          <div className="sentence-taxonomy">
                            <Localized id="target-segment-generic-card">
                              <span className="taxonomy-message" />
                            </Localized>
                            <StyledLink
                              className="taxonomy-link"
                              blank
                              href={`${URLS.GITHUB_ROOT}/blob/main/docs/taxonomies/${sentence.taxonomy.source}.md`}>
                              <ExternalLinkIcon />
                              <Localized id="target-segment-learn-more">
                                <span />
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
          )}

          {shouldShowFirstCTA || shouldShowSecondCTA ? (
            <div />
          ) : (
            <div className="pills">
              <div className="inner">
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
                        Math.min(Math.max(selectedPill, 1), pills.length - 2) -
                          i
                      ) > 1
                        ? { display: 'none' }
                        : {},
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {!user.account && shouldShowFirstCTA && (
          <FirstPostSubmissionCta
            locale={this.props.locale}
            onReset={onReset}
            addNotification={this.props.addNotification}
            successUploadMessage={getString('thanks-for-voice-toast')}
            errorUploadMessage={getString('thanks-for-voice-toast-error')}
          />
        )}

        {!user.account && shouldShowSecondCTA && (
          <SecondPostSubmissionCTA onReset={onReset} />
        )}

        {instruction({
          vars: { actionType: getString('action-tap') },
          children: <div className="instruction hidden-md-up" />,
        }) || <div className="instruction hidden-md-up" />}

        <div className="primary-buttons">
          <canvas ref={this.canvasRef} />
          {primaryButtons}
        </div>

        {!hasErrors && !isSubmitted && (
          <LocaleLink
            blank
            to={URLS.CRITERIA}
            className="contribution-criteria hidden-md-up">
            <ExternalLinkIcon />
            <Localized id="contribution-criteria-link" />
          </LocaleLink>
        )}

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
            {onSubmit && !shouldShowFirstCTA && !shouldShowSecondCTA && (
              <form
                onSubmit={onSubmit}
                className="contribution-speak-form"
                data-testid="speak-submit-form">
                {this.isDone && (
                  <LabeledCheckbox
                    label={
                      <Localized
                        id="accept-privacy-and-terms"
                        elems={{
                          termsLink: <LocaleLink to={URLS.TERMS} blank />,
                          privacyLink: <LocaleLink to={URLS.PRIVACY} blank />,
                        }}>
                        <span />
                      </Localized>
                    }
                    required
                    onChange={handlePrivacyAgreedChange}
                    checked={privacyAgreedChecked}
                    shouldShowTooltip
                    isTooltipOpen={isFirstSubmit}
                    tooltipTitle={getString(
                      'review-instruction-checkbox-tooltip'
                    )}
                    data-testid="checkbox"
                  />
                )}
                <Localized id="submit-form-action">
                  <PrimaryButton
                    className={[
                      'submit',
                      getTrackClass('fs', `submit-${type}`),
                    ].join(' ')}
                    disabled={!this.isDone || !privacyAgreedChecked}
                    type="submit"
                  />
                </Localized>
              </form>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ flags, locale, user }: StateTree) => ({
    flags,
    locale,
    user,
  }),
  {
    addNotification: Notifications.actions.addPill,
  }
)(withLocalization(ContributionPage));
