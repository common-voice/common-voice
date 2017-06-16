import { h, Component } from 'preact';
import Icon from './icon';

interface Props {
  src?: string;
  sentence?: string;
  vote?: string;
  onVote?(valid: boolean): void;
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

  constructor(props: Props) {
    super(props);

    // Pre-bind some handlers to avoid memory leaks later.
    this.onLoadStart = this.onLoadStart.bind(this);
    this.onCanPlayThrough = this.onCanPlayThrough.bind(this);
    this.onPlayEnded = this.onPlayEnded.bind(this);
    this.onPlay = this.onPlay.bind(this);
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

  render() {
    return <div className={'listen-box' +
                           (this.state.loaded ? ' loaded' : '') +
                           (this.state.playing ? ' playing' : '')}>
      <div className="sentence-box"><b>What we asked them to read:</b>{this.props.sentence}</div>
      <div onClick={this.onPlay} class="play-box">
        <b>What they said:</b>
        <Icon type={this.state.playing ? 'pause': 'play'} />
      </div>
      <div style={!this.props.vote ? 'display: none;' : ''} class="vote-box">
        <a onClick={e=>{this.props.onVote(true);}}>
          <Icon type="check"/>Sure is!</a>
        <a onClick={e=>{this.props.onVote(false);}}>
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
