import { h, Component } from 'preact';
import ListenBox from './listen-box';
import { Clip, default as API } from '../api';

interface Props {
}

interface State {
  clip: Clip
}

/**
 * Widget for validating voice clips.
 */
export default class Validator extends Component<Props, State> {
  api: API;

  constructor(props) {
    super(props);
    this.api = new API();

    this.loadClip = this.loadClip.bind(this);
    this.loadClip();
  }

  private loadClip() {
    this.api.getRandomClip().then((clip) => {
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
