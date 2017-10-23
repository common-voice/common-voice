import { h, Component } from 'preact';
import Validator from '../../validator';
import API from '../../../api';
import User from '../../../user';

interface Props {
  api: API;
  active: string;
  navigate(url: string): void;
  user?: User;
}

export default class Home extends Component<Props, void> {
  constructor(props: Props) {
    super(props);
    this.onVote = this.onVote.bind(this);
  }

  onVote() {
    this.props.user && this.props.user.tallyVerification();
    this.props.navigate('/'); // force top level page render
  }

  render() {
    return (
      <div id="home-container" className={this.props.active}>
        <h1 id="home-title">Project Common Voice</h1>
        <div id="home-layout">
          <div className="left-column">
            <p>
              Voice is natural, voice is human. That’s why we’re fascinated with
              creating usable voice technology for our machines. But to create
              voice systems, an extremely large amount of voice data is
              required. Most of the data used by large companies isn’t available
              to the majority of people. We think that stifles innovation. So
              we’ve launched Project Common Voice, a project to help make voice
              recognition open to everyone. Now you can donate your voice to
              help us build an open-source voice database that anyone can use to
              make innovative apps for devices and the web.
            </p>

            <p>
              Read a sentence to help machines learn how real people speak.
              Check the work of other contributors to improve the quality. It’s
              that simple!
            </p>
          </div>
          <div className="right-column">
            <p class="strong">You can also help by validating donations!</p>
            <img class="curved-arrow" src="/img/curved-arrow.png" />
            <img class="circle" src="/img/circle.png" />
          </div>
          <div id="donate">
            <button
              onClick={evt => {
                this.props.navigate('/record');
              }}>
              Donate your voice!
            </button>
          </div>
        </div>
        <div id="try-it-container">
          <h1>Help us validate sentences!</h1>
          <Validator onVote={this.onVote} api={this.props.api} />
        </div>
      </div>
    );
  }
}
