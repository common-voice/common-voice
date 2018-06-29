import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackListening } from '../../services/tracker';
import { Locale } from '../../stores/locale';
import StateTree from '../../stores/tree';
import { FontIcon, OldPlayIcon, OldRedoIcon } from '../ui/icons';
import URLS from '../../urls';
import { LinkButton } from '../ui/ui';

const VOTE_NO_PLAY_MS = 3000; // Threshold when to allow voting no

interface PropsFromState {
  locale: Locale.State;
}

interface Props extends LocalizationProps, PropsFromState {
  src?: string;
  sentence?: string | React.ReactNode;
  vote?: boolean;
  onVote?(valid: boolean): void;
  onDelete?(): void;
  showSpeakButton?: boolean;
}

interface State {
  loaded: boolean;
  played: boolean;
  playedSome: boolean;
  playing: boolean;
  audio: HTMLAudioElement;
  shortcutsEnabled: boolean;
}

/**
 * Widget for listening to a recording.
 */
class ListenBox extends React.Component<Props, State> {
  el: HTMLAudioElement;
  playedSomeInterval: any;

  constructor(props: Props) {
    super(props);

    // Pre-bind some handlers to avoid memory leaks later.
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
    this.onPlayEnded = this.onPlayEnded.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.voteYes = this.voteYes.bind(this);
    this.voteNo = this.voteNo.bind(this);
  }

  state: State = {
    loaded: false,
    playing: false,
    played: false,
    playedSome: false,
    audio: null,
    shortcutsEnabled: false,
  };

  componentDidUpdate(nextProps: Props) {
    if (nextProps.sentence !== this.props.sentence) {
      this.resetState();
    }
  }

  componentWillUnmount() {
    clearInterval(this.playedSomeInterval);
  }

  private resetState() {
    this.setState({
      loaded: false,
      playing: false,
      played: false,
      playedSome: false,
      audio: null,
    });
    clearInterval(this.playedSomeInterval);
  }

  private onLoadStart() {
    this.setState({
      loaded: false,
    });
  }

  private onCanPlayThrough() {
    this.setState({
      loaded: true,
    });
  }

  private onPlayEnded() {
    this.setState({ playing: false, played: true });
    trackListening('listen-home', this.props.locale);
  }

  private onPlay() {
    if (this.state.playing) {
      this.el.pause();
      this.el.currentTime = 0;
      this.setState({ playing: false });
      return;
    }

    this.el.play();
    this.setState({ playing: true });
    clearInterval(this.playedSomeInterval);
    this.playedSomeInterval = setInterval(
      () => this.setState({ playedSome: true }),
      VOTE_NO_PLAY_MS
    );
  }

  private onDelete() {
    if (this.state.playing) {
      this.el.pause();
      this.setState({ playing: false });
    }

    this.props.onDelete && this.props.onDelete();
  }

  private vote(votedYes: boolean): void {
    if (!this.state.loaded) {
      return;
    }

    this.setState({
      loaded: false,
      playing: false,
      played: false,
      playedSome: false,
    });

    this.props.onVote && this.props.onVote(votedYes);
  }

  private voteYes() {
    if (!this.state.played) {
      return;
    }
    this.vote(true);
    trackListening('vote-yes', this.props.locale);
  }

  private voteNo() {
    const { played, playedSome } = this.state;
    if (!played && !playedSome) {
      return;
    }
    this.vote(false);
    trackListening('vote-no', this.props.locale);
  }

  private enableShortcuts = () => this.setState({ shortcutsEnabled: true });
  private disableShortcuts = () => this.setState({ shortcutsEnabled: false });

  private handleKeyDown = (event: React.KeyboardEvent<any>) => {
    const { getString, locale } = this.props;
    if (!this.state.shortcutsEnabled) return;

    switch (event.key) {
      case getString('shortcut-play-toggle'):
        this.onPlay();
        break;

      case getString('shortcut-vote-yes'):
        this.voteYes();
        break;

      case getString('shortcut-vote-no'):
        this.voteNo();
        break;

      default:
        return;
    }
    trackListening('shortcut', locale);
    event.preventDefault();
  };

  render() {
    const { getString, sentence, showSpeakButton, vote } = this.props;
    const {
      loaded,
      playing,
      played,
      playedSome,
      shortcutsEnabled,
    } = this.state;
    return (
      <div
        tabIndex={-1}
        onFocus={this.enableShortcuts}
        onBlur={this.disableShortcuts}
        onKeyDown={this.handleKeyDown}
        className={
          'listen-box' + (loaded ? ' loaded' : '') + (playing ? ' playing' : '')
        }>
        <div className={'sentence-box ' + (showSpeakButton ? 'disabled' : '')}>
          {sentence}
        </div>
        {!showSpeakButton && (
          <button
            onClick={this.onPlay}
            className="play-box"
            title={shortcutsEnabled ? getString('toggle-play-tooltip') : ''}>
            {playing ? <FontIcon type="stop" /> : <OldPlayIcon />}
          </button>
        )}
        {showSpeakButton ? (
          <Localized id="speak-now">
            <LinkButton className="speak" outline rounded to={URLS.SPEAK} />
          </Localized>
        ) : vote ? (
          <div className="vote-box">
            <button
              onClick={this.voteYes}
              onTouchStart={this.voteYes}
              disabled={!played}>
              {this.renderShortcutText('vote-yes')}
            </button>
            <button
              onClick={this.voteNo}
              onTouchStart={this.voteNo}
              disabled={!played && !playedSome}>
              {this.renderShortcutText('vote-no')}
            </button>
          </div>
        ) : (
          <button className="delete-box" onClick={this.onDelete}>
            <OldRedoIcon />
          </button>
        )}
        <audio
          // Only include the src attribute if the source is defined
          // (empty src attributes are invalid)
          {...this.props.src && { src: this.props.src }}
          preload="auto"
          onLoadStart={this.onLoadStart}
          onLoadedData={this.onCanPlayThrough}
          onCanPlayThrough={this.onCanPlayThrough}
          onDurationChange={this.onCanPlayThrough}
          onEnded={this.onPlayEnded}
          ref={el => (this.el = el as HTMLAudioElement)}
        />
      </div>
    );
  }

  renderShortcutText(stringId: string) {
    const { getString } = this.props;
    const text = getString(stringId);
    const shortcut = getString('shortcut-' + stringId);
    const shortcutIndex = text.toLowerCase().indexOf(shortcut);

    return !this.state.shortcutsEnabled || shortcutIndex === -1
      ? text
      : [
          text.slice(0, shortcutIndex),
          <span key="shortcut" style={{ textDecoration: 'underline' }}>
            {shortcut}
          </span>,
          text.slice(shortcutIndex + 1),
        ];
  }
}

export default connect<PropsFromState>(({ locale }: StateTree) => ({ locale }))(
  withLocalization(ListenBox)
);
