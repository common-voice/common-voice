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
  played: boolean;
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

  state: State = {
    loaded: false,
    playing: false,
    played: false,
    audio: null,
  };

  private resetState() {
    this.setState({
      loaded: false,
      playing: false,
      played: false,
      audio: null,
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.sentence !== this.props.sentence) {
      this.resetState();
    }
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
    this.tracker.trackListen();
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
    this.tracker.trackVoteYes();
  }

  private voteNo() {
    if (!this.state.played) {
      return;
    }
    this.vote(false);
    this.tracker.trackVoteNo();
  }

  render() {
    return (
      <div
        className={
          'listen-box' +
          (this.state.loaded ? ' loaded' : '') +
          (this.state.playing ? ' playing' : '')
        }>
        <div className="sentence-box">
          <b style={!this.props.vote ? 'display: none;' : ''}>
            What we asked them to read:
          </b>
          {this.props.sentence}
        </div>
        <div onClick={this.onPlay} class="play-box">
          <b style={!this.props.vote ? 'display: none;' : ''}>
            What they said:
          </b>
          <Icon type={this.state.playing ? 'stop' : 'play'} />
        </div>
        <div
          style={this.props.vote ? 'display: none;' : ''}
          class="delete-box"
          onClick={this.onDelete}>
          <Icon type="x" />
        </div>
        <div
          style={!this.props.vote ? 'display: none;' : ''}
          className={'vote-box ' + (this.state.played ? '' : 'disabled')}>
          <a onClick={this.voteYes}>
            <Icon type="check" />Yes!
          </a>
          <a onClick={this.voteNo}>
            <Icon type="x" />Nope.
          </a>
        </div>
        <audio
          className="audio-box"
          // Only include the src attribute if the source is defined
          // (empty src attributes are invalid)
          {...this.props.src && { src: this.props.src }}
          preload="auto"
          onLoadStart={this.onLoadStart}
          onCanPlayThrough={this.onCanPlayThrough}
          onDurationChange={this.onCanPlayThrough}
          onEnded={this.onPlayEnded}
          ref={el => (this.el = el as HTMLAudioElement)}
        />
      </div>
    );
  }
}
