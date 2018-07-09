import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
const { Tooltip } = require('react-tippy');
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { trackListening, trackRecording } from '../../../services/tracker';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import Modal from '../../modal/modal';
import {
  ArrowLeft,
  CheckIcon,
  KeyboardIcon,
  ShareIcon,
  SkipIcon,
} from '../../ui/icons';
import { Button } from '../../ui/ui';
import { PrimaryButton } from './primary-buttons';
import ShareModal from './share-modal';
import Success from './success';
import Wave from './wave';

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
  locale: Locale.State;
}

interface Props extends LocalizationProps, PropsFromState {
  activeIndex: number;
  errorContent?: any;
  extraButton?: React.ReactNode;
  instruction: (
    props: { $actionType: string; children: any }
  ) => React.ReactNode;
  isFirstSubmit?: boolean;
  isPlaying: boolean;
  isSubmitted: boolean;
  onReset: () => any;
  onSkip: () => any;
  onSubmit?: () => any;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  sentences: string[];
  shortcuts: {
    key: string;
    label: string;
    action: () => any;
  }[];
  type: 'speak' | 'listen';
}

interface State {
  selectedPill: number;
  showShareModal: boolean;
  showShortcutsModal: boolean;
}

class ContributionPage extends React.Component<Props, State> {
  static defaultProps = {
    isFirstSubmit: false,
  };

  state: State = {
    selectedPill: null,
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

    if (this.wave) {
      this.props.isPlaying ? this.wave.play() : this.wave.idle();
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

  private toggleShortcutsModal = () =>
    this.setState({ showShortcutsModal: !this.state.showShortcutsModal });

  private handleKeyDown = (event: any) => {
    const {
      getString,
      isSubmitted,
      locale,
      onReset,
      onSubmit,
      type,
    } = this.props;
    if (event.ctrlKey || event.altKey || event.shiftKey) return;

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
      ({ key }) => getString(key) === event.key
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
    const { errorContent, getString, isSubmitted, type } = this.props;
    const { showShareModal, showShortcutsModal } = this.state;

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

            {this.isLoaded && !errorContent ? (
              <div className={'counter ' + (isSubmitted ? 'done' : '')}>
                {isSubmitted && <CheckIcon />}
                {this.renderCounter()}
                <Localized id="clips" $count={''}>
                  <span className="text" />
                </Localized>
              </div>
            ) : (
              <div />
            )}
            {isSubmitted && (
              <button className="open-share" onClick={this.toggleShareModal}>
                <ShareIcon />
              </button>
            )}
          </div>

          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderCounter() {
    const { activeIndex, isSubmitted } = this.props;
    return (
      (isSubmitted ? SET_COUNT : activeIndex + 1 || SET_COUNT) + '/' + SET_COUNT
    );
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
                        className={
                          'card card-dimensions ' + (isActive ? '' : 'inactive')
                        }
                        style={{
                          transform: [
                            `scale(${isActive ? 1 : 0.9})`,
                            `translateX(${(i - activeSentenceIndex) * -130}%)`,
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
                      <PrimaryButton
                        className="submit"
                        disabled={!this.isDone}
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

export default connect<PropsFromState>(({ locale }: StateTree) => ({ locale }))(
  withLocalization(ContributionPage)
);
