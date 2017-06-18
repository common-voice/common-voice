import { h, Component } from 'preact';
import ListenBox from './listen-box';
import { Clip, default as API } from '../api';

interface Props {
  api: API;
  onVote?(valid: boolean): void;
}

interface State {
  clip: Clip
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
    this.props.api.getRandomClip().then((clip) => {
      this.setState({ clip: clip });
    }, (err) => {
      console.error('could not fetch random clip for validator', err);
    });
  }

  render() {
    return <div class="validator">
      <ListenBox src={this.state.clip && this.state.clip.audio}
                 sentence={this.state.clip && this.state.clip.sentence}
                 onVote={this.onVote} vote="true" />
    </div>;
  }
}
