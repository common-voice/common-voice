import { h, Component } from 'preact';
import ListenBox from '../listen-box';

interface Props {
  active: string;
  navigate(url: string): void;
}

export default class Home extends Component<Props, void> {
  render() {
    return <div id="home-container" className={this.props.active}>
      <h1 id="home-title">Project Common Voice</h1>
      <div id="home-layout">
        <div className="left-column">
          <p>Build the world's most diverse set of voice data that researchers
          and others can use for free to create better voice technologies for
          the Internet.
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book.</p>
          <button id="donate" onClick={evt => {
            this.props.navigate('/record')}}>Get started!</button>
        </div>
        <div className="right-column">
          <p>You can also help by validating donations!</p>
        </div>
      </div>
      <div id="try-it-container">
        <h2>Try it!</h2>
        <ListenBox src="missing" sentence="First sentence to read."/>
      </div>
    </div>;
  }
}
