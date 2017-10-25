import { h, Component } from 'preact';
import ListenBox from './listen-box/listen-box';
import { ClipJson, default as API } from '../api';

const LOADING_MESSAGE = 'Loading...';
const LOAD_ERROR_MESSAGE =
  'Sorry! We are processing our audio files, please try again shortly.';

interface Props {
  api: API;
  onVote?(valid: boolean): void;
}

interface State {
  loading: boolean;
  glob: string;
  sentence: string;
  audioSrc: string;
}

/**
 * Widget for validating voice clips.
 */
export default class Validator extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.onVote = this.onVote.bind(this);
    this.loadClip = this.loadClip.bind(this);
    this.loadClip();
  }

  private async onVote(vote: boolean) {
    try {
      await this.props.api.castVote(this.state.glob, vote);
      this.props.onVote && this.props.onVote(vote);
      this.loadClip();
    } catch (err) {
      console.error('could not vote on clip from validator', err);
    }
  }

  private async loadClip() {
    this.setState({ loading: true });
    try {
      const clipJson = await this.props.api.getRandomClipJson();
      this.setState({
        loading: false,
        glob: clipJson.glob,
        sentence: decodeURIComponent(clipJson.text),
        audioSrc: clipJson.sound,
      });
    } catch (err) {
      console.error('could not fetch random clip for validator', err);
      this.setState({ loading: false, sentence: null, audioSrc: null });
    }
  }

  render() {
    let sentence;
    if (this.state.loading) {
      sentence = LOADING_MESSAGE;
    } else if (this.state.sentence) {
      sentence = this.state.sentence;
    } else {
      sentence = LOAD_ERROR_MESSAGE;
    }

    return (
      <div class="validator">
        <ListenBox
          src={this.state.audioSrc}
          sentence={sentence}
          onVote={this.onVote}
          vote="true"
        />
      </div>
    );
  }
}
