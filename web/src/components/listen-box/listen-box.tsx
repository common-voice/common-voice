import * as React from 'react';
const { Fragment } = require('react');
import { trackListening } from '../../services/tracker';
import { FontIcon, PlayIcon, RedoIcon } from '../ui/icons';

interface Props {
  src?: string;
  sentence?: string;
  vote?: boolean;
  onVote?(valid: boolean): void;
  onDelete?(): void;
}

interface State {
  loaded: boolean;
  played: boolean;
  playing: boolean;
  audio: HTMLAudioElement;
  shortcutsEnabled: boolean;
}

/**
 * Widget for listening to a recording.
 */
export default class ListenBox extends React.Component<Props, State> {
  el: HTMLAudioElement;

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
    loaded: true,
    playing: false,
    played: false,
    audio: null,
    shortcutsEnabled: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sentence !== this.props.sentence) {
      this.resetState();
    }
  }

  private resetState() {
    this.setState({
      loaded: false,
      playing: false,
      played: false,
      audio: null,
    });
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
  }

  private onDelete() {
    if (this.state.playing) {
      this.el.pause();
      this.setState({ playing: false });
      return;
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
    if (!this.state.played) {
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
    const { loaded, playing, played, shortcutsEnabled } = this.state;
    return (
      <div
        tabIndex={-1}
        onFocus={this.enableShortcuts}
        onBlur={this.disableShortcuts}
        onKeyDown={this.handleKeyDown}
        className={
          'listen-box' + (loaded ? ' loaded' : '') + (playing ? ' playing' : '')
        }>
        <div className="sentence-box">{this.props.sentence}</div>
        <button
          onClick={this.onPlay}
          className="play-box"
          title={
            shortcutsEnabled ? 'Press p to ' + (playing ? 'pause' : 'play') : ''
          }>
          {playing ? <FontIcon type="stop" /> : <PlayIcon />}
        </button>
        {this.props.vote ? (
          <div className={'vote-box ' + (played ? '' : 'disabled')}>
            <button onClick={this.voteYes} onTouchStart={this.voteYes}>
              {this.renderShortcutText('Yes')}
            </button>
            <button onClick={this.voteNo} onTouchStart={this.voteNo}>
              {this.renderShortcutText('No')}
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
      <Fragment>
        <span style={{ textDecoration: 'underline' }}>{text.charAt(0)}</span>
        {text.substr(1)}
      </Fragment>
    ) : (
      text
    );
  }
}
