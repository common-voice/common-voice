import { h, Component } from 'preact';
import Tracker from '../tracker';
import Icon from './icon';

interface Props {
  src?: string;
  sentence?: string;
  vote?: string;
  onVote?(valid: boolean): void;
  onDelete?(): void;
}

interface State {
  loaded: boolean;
  playing: boolean;
  audio: HTMLAudioElement;
}

/**
 * Widget for listening to a recording.
 */
export default class ListenBox extends Component<Props, State> {
  el: HTMLAudioElement;
  tracker: Tracker;

  constructor(props: Props) {
    super(props);

    this.tracker = new Tracker();

    // Pre-bind some handlers to avoid memory leaks later.
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
    this.onPlayEnded = this.onPlayEnded.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.voteYes = this.voteYes.bind(this);
    this.voteNo = this.voteNo.bind(this);
  }

  state = {
    loaded: false,
    playing: false,
    audio: null
  };

  private onLoadStart() {
    this.setState({
      loaded: false
    });
  }

  private onCanPlayThrough() {
    this.setState({
      loaded: true
    });
  }

  private onPlayEnded() {
    this.setState({ playing: false });
    this.tracker.trackListen();
  }

  private onPlay() {
    if (this.state.playing) {
      this.el.pause();
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

  private voteYes() {
    if (!this.state.loaded) {
      return;
    }

    this.setState({
      loaded: false
    });

    this.props.onVote && this.props.onVote(true);
    this.tracker.trackVoteYes();
  }

  private voteNo() {
    if (!this.state.loaded) {
      return;
    }

    this.setState({
      loaded: false
    });

    this.props.onVote && this.props.onVote(false);
    this.tracker.trackVoteNo();
  }

  render() {
    return <div className={'listen-box' +
                           (this.state.loaded ? ' loaded' : '') +
                           (this.state.playing ? ' playing' : '')}>
      <div className="sentence-box">
        <b style={!this.props.vote ? 'display: none;' : ''}>
          What we asked them to read:
        </b>{this.props.sentence}
      </div>
      <div onClick={this.onPlay} class="play-box">
        <b style={!this.props.vote ? 'display: none;' : ''}>What they said:</b>
        <Icon type={this.state.playing ? 'pause': 'play'} />
      </div>
      <div style={this.props.vote ? 'display: none;' : ''} class="delete-box"
           onClick={this.onDelete}>
        <Icon type="x"/>
      </div>
      <div style={!this.props.vote ? 'display: none;' : ''} class="vote-box">
        <a onClick={this.voteYes}>
          <Icon type="check"/>Yes!</a>
        <a onClick={this.voteNo}>
          <Icon type="x"/>Nope.</a>
      </div>
      <audio className="audio-box"
        src={this.props.src}
        onLoadStart={this.onLoadStart}
        onCanPlayThrough={this.onCanPlayThrough}
        // onPlay={this.onPlay}
        onEnded={this.onPlayEnded}
        ref={el => this.el = el as HTMLAudioElement} />
    </div>;
  }
}
