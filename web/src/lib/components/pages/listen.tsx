import { h, Component } from 'preact';
import { Clip, default as API } from '../../api';

interface ListenPageProps {
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
    const api = new API();
    // Ask the server for some random clip to verify.
    api.getRandomClip().then((clip) => {
      this.setState({ clip: clip });
    }, (err) => {
      this.setState({ error: err });
    });
  }

  render() {
    return <div id="listen-container" className={this.props.active}>
      {this.state.error && <div>{this.state.error}</div>}
      {this.state.clip && <PreviewClip clip={this.state.clip} />}
    </div>
  }
}

const PreviewClip = (props: {clip: Clip}) => (
  <div>
    <audio src={props.clip.audio} controls></audio>
    <p>{props.clip.sentence}</p>
    <form>
      <label className="validate-lbl" for="yes-validate">
        <input id="yes-validate" type="radio" name="validate" value="yes" />
        Yes
      </label>
      <label className="validate-lbl" for="no-validate">
        <input id="no-validate" type="radio" name="validate" value="no" />
        No
      </label>
      <button id="listen-submit" type="submit">Submit</button>
    </form>
  </div>
);
