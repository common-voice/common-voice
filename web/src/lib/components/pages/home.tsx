import { h, Component } from 'preact';
import Validator from '../validator';
import API from '../../api';
import User from '../../user';

interface Props {
  api: API;
  active: string;
  navigate(url: string): void;
  user?: User;
}

export default class Home extends Component<Props, void> {
  constructor(props) {
    super(props);
    this.onVote = this.onVote.bind(this);
  }

  onVote() {
    this.props.user && this.props.user.tallyVerification();
    this.props.navigate('/'); // force top level page render
  }

  render() {
    return <div id="home-container" className={this.props.active}>
      <h1 id="home-title">Project Common Voice</h1>
      <div id="home-layout">
        <div className="left-column">
          <p>Voice is natural, voice is human. That’s why we’re fascinated with creating usable voice technology for our machines. But most of that technology is locked up in a few big corporations and isn’t available to the majority of developers. We think that stifles innovation so we’re launching Project Common Voice, a project to help make voice recognition open to everyone. Now you can donate your voice to help us build an open-source voice recognition engine that anyone can use to make innovative apps for devices and the web.</p>

          <p>Read a sentence to help our machine learn how real people speak. Check its work to help it improve. It’s that simple.</p>
        </div>
        <div className="right-column">
          <p class="strong">You can also help by validating donations!</p>
          <img class="curved-arrow" src="/img/curved-arrow.png" />
          <img class="circle" src="/img/circle.png" />
        </div>
        <div id="donate">
          <button onClick={evt => {
            this.props.navigate('/record')}}>Donate your voice!</button>
        </div>
      </div>
      <div id="try-it-container">
        <h1>Try it!</h1>
        <p id="help-home" class="strong">Help us validate&nbsp;<span>sentences.</span></p>
        <Validator onVote={this.onVote} api={this.props.api} />
      </div>
    </div>;
  }
}
