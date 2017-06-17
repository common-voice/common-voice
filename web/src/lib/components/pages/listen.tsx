import { h, Component } from 'preact';
import { Clip, default as API } from '../../api';
import ListenBox from '../listen-box';

interface ListenPageProps {
  api: API;
  active: string;
}

interface State {
  clip: Clip,
  error: any
}

export default class Listen extends Component<ListenPageProps, State> {
  audio: HTMLAudioElement;
  sentence: HTMLElement;

  componentWillMount() {
    // Ask the server for some random clip to verify.
    this.props.api.getRandomClip().then((clip) => {
      this.setState({ clip: clip });
    }, (err) => {
      this.setState({ error: err });
    });
  }

  render() {
    return <div id="listen-container" className={this.props.active}>
      {this.state.error && <div>{this.state.error}</div>}
      {this.state.clip && <ListenBox vote="true" src={this.state.clip.audio}
                                     sentence={this.state.clip.sentence}/>}
    </div>
  }
}
