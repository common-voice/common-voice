import { h, Component } from 'preact';
import ListenBox from './listen-box';
import { Clip, default as API } from '../api';

interface Props {
  api: API;
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
    this.loadClip = this.loadClip.bind(this);
    this.loadClip();
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
                 onVote={this.loadClip} vote="true" />
    </div>;
  }
}
