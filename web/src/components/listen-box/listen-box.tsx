import * as React from 'react';
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

  render() {
    return (
      <div
        className={
          'listen-box' +
          (this.state.loaded ? ' loaded' : '') +
          (this.state.playing ? ' playing' : '')
        }>
        <div className="sentence-box">{this.props.sentence}</div>
        <div onClick={this.onPlay} className="play-box">
          {this.state.playing ? <FontIcon type="stop" /> : <PlayIcon />}
        </div>
        {this.props.vote ? (
          <div className={'vote-box ' + (this.state.played ? '' : 'disabled')}>
            <a onClick={this.voteYes}>Yes</a>
            <a onClick={this.voteNo}>No</a>
          </div>
        ) : (
          <div className="delete-box" onClick={this.onDelete}>
            <RedoIcon />
          </div>
        )}
        <audio
          className="audio-box"
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
}
