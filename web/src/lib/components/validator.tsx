import { h, Component } from 'preact';
import ListenBox from './listen-box';
import { ClipJson, default as API } from '../api';

const LOADING_MESSAGE = 'Loading...';
const LOAD_ERROR_MESSAGE = 'Sorry! We are processing our audio files, please try again shortly.';

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

  constructor(props) {
    super(props);
    this.onVote = this.onVote.bind(this);
    this.loadClip = this.loadClip.bind(this);
    this.loadClip();
  }

  private onVote(vote: boolean) {
    this.props.api.castVote(this.state.glob, vote).then(() => {
      this.props.onVote && this.props.onVote(vote);
      this.loadClip();
    }).catch((err) => {
      console.error('could not vote on clip from validator', err);
    });
  }

  private loadClip() {
    this.setState({ loading: true });
    this.props.api.getRandomClipJson().then((clipJson: ClipJson) => {

      this.setState({
        loading: false,
        glob: clipJson.glob,
        sentence: decodeURIComponent(clipJson.text),
        audioSrc: clipJson.sound
      });
    }, (err) => {
      console.error('could not fetch random clip for validator', err);
      this.setState({ loading: false, sentence: null, audioSrc: null });
    });
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

    return <div class="validator">
      <ListenBox src={this.state.audioSrc}
                 sentence={sentence}
                 onVote={this.onVote} vote="true" />
      <p>When validating, please press the "nope" button if the sentence is not read exactly.</p>
    </div>;
  }
}
