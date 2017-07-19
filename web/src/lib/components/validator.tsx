import { h, Component } from 'preact';
import ListenBox from './listen-box';
import { Clip, default as API } from '../api';

const LOADING_MESSAGE = 'Loading...';
const ERROR_MESSAGE = 'Sorry! We coudln\'t load the audio, please try again later';

interface Props {
  api: API;
  onVote?(valid: boolean): void;
}

interface State {
  loading: boolean;
  clip: Clip;
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
    this.props.api.castVote(this.state.clip.glob, vote).then(() => {
      this.props.onVote && this.props.onVote(vote);
      this.loadClip();
    }).catch((err) => {
      console.error('could not vote on clip from validator', err);
    });
  }

  private loadClip() {
    this.setState({ loading: true });
    this.props.api.getRandomClip().then((clip) => {
      this.setState({ loading: false, clip: clip });
    }, (err) => {
      console.error('could not fetch random clip for validator', err);
      this.setState({ loading: false, clip: null });
    });
  }

  render() {
    let sentence;
    if (this.state.loading) {
      sentence = LOADING_MESSAGE;
    } else if (this.state.clip) {
      sentence = this.state.clip.sentence;
    } else {
      sentence = ERROR_MESSAGE;
    }

    return <div class="validator">
      <ListenBox src={this.state.clip && this.state.clip.audio}
                 sentence={sentence}
                 onVote={this.onVote} vote="true" />
    </div>;
  }
}
