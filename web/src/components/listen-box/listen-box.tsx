import { LocalizationProps, withLocalization } from 'fluent-react';
import * as React from 'react';
import { trackListening } from '../../services/tracker';
import { FontIcon, PlayIcon, RedoIcon } from '../ui/icons';

const VOTE_NO_PLAY_MS = 3000; // Threshold when to allow voting no

interface Props extends LocalizationProps {
  src?: string;
  sentence?: string | React.ReactNode;
  vote?: boolean;
  onVote?(valid: boolean): void;
  onDelete?(): void;
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
    trackListening('listen');
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
    trackListening('vote-yes');
  }

  private voteNo() {
    const { played, playedSome } = this.state;
    if (!played && !playedSome) {
      return;
    }
    this.vote(false);
    trackListening('vote-no');
  }

  private enableShortcuts = () => this.setState({ shortcutsEnabled: true });
  private disableShortcuts = () => this.setState({ shortcutsEnabled: false });

  private handleKeyDown = (event: React.KeyboardEvent<any>) => {
    if (!this.state.shortcutsEnabled) return;

    switch (event.key) {
      case 'p':
        this.onPlay();
        break;

      case 'y':
        this.voteYes();
        break;

      case 'n':
        this.voteNo();
        break;

      default:
        return;
    }
    trackListening('shortcut');
    event.preventDefault();
  };

  render() {
    const { getString, sentence, vote } = this.props;
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
        <div className="sentence-box">{sentence}</div>
        <button
          onClick={this.onPlay}
          className="play-box"
          title={
            shortcutsEnabled ? 'Press p to ' + (playing ? 'pause' : 'play') : ''
          }>
          {playing ? <FontIcon type="stop" /> : <PlayIcon />}
        </button>
        {vote ? (
          <div className="vote-box">
            <button
              onClick={this.voteYes}
              onTouchStart={this.voteYes}
              disabled={!played}>
              {this.renderShortcutText(getString('vote-yes'))}
            </button>
            <button
              onClick={this.voteNo}
              onTouchStart={this.voteNo}
              disabled={!played && !playedSome}>
              {this.renderShortcutText(getString('vote-no'))}
            </button>
          </div>
        ) : (
          <button className="delete-box" onClick={this.onDelete}>
            <RedoIcon />
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

  renderShortcutText(text: string) {
    return this.state.shortcutsEnabled ? (
      <React.Fragment>
        <span style={{ textDecoration: 'underline' }}>{text.charAt(0)}</span>
        {text.substr(1)}
      </React.Fragment>
    ) : (
      text
    );
  }
}

export default withLocalization(ListenBox);
