import * as React from 'react';
import { connect } from 'react-redux';
import API from '../services/api';
import StateTree from '../stores/tree';
import ListenBox from './listen-box/listen-box';

const LOADING_MESSAGE = 'Loading...';
const LOAD_ERROR_MESSAGE =
  'Sorry! We are processing our audio files, please try again shortly.';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {
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
class Validator extends React.Component<Props, State> {
  state = { loading: false, glob: '', sentence: '', audioSrc: '' };
  private _isMounted = false;

  constructor(props: Props) {
    super(props);
    this.onVote = this.onVote.bind(this);
    this.loadClip = this.loadClip.bind(this);
  }

  async componentDidMount() {
    this._isMounted = true;
    await this.loadClip();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  private async onVote(vote: boolean) {
    try {
      await this.props.api.castVote(this.state.glob, vote);
      if (!this._isMounted) return;
      this.props.onVote && this.props.onVote(vote);
      this.loadClip();
    } catch (err) {
      console.error('could not vote on clip from validator', err);
    }
  }

  private async loadClip() {
    this.setState({ loading: true });
    try {
      const clip = await this.props.api.getRandomClip();
      if (!this._isMounted) return;
      this.setState({
        loading: false,
        glob: clip.glob,
        sentence: decodeURIComponent(clip.text),
        audioSrc: clip.sound,
      });
    } catch (err) {
      console.error('could not fetch random clip for validator', err);
      if (!this._isMounted) return;
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
      <div className="validator">
        <ListenBox
          src={this.state.audioSrc}
          sentence={sentence}
          onVote={this.onVote}
          vote
        />
      </div>
    );
  }
}

export default connect<PropsFromState>(({ api }: StateTree) => ({
  api,
}))(Validator);
