import { h, Component } from 'preact';

interface Props {
  active: string;
  navigate(url: string): void;
}

export default class Home extends Component<Props, void> {
  render() {
    return <div className={this.props.active}>
      <img id="home-robot" src="/img/robot.png" />
      <h2>Mozilla's Common Voice</h2>
      <p>Build the world's most diverse set of voice data that researchers
      and others can use for free to create better voice technologies for
      the Internet.</p>

      <p>Interested in helping out? It only takes a minute and doesn't
      cost you a dime!</p>
      <button id="donate" onClick={evt => {
        this.props.navigate('/record')}}>Get started!</button>

      <p>Your voice donations will be made available for researchers and
      others to use under a
      <a href="https://creativecommons.org/publicdomain/zero/1.0/">
      Creative Commons license</a>. Your name or any other identifying
      information will not be associated with this voice data.</p>

      <p>This project is governed by
      <a href="https://mozilla.org/privacy/websites/">
            Mozilla's Privacy Policy</a></p>
    </div>;
  }
}
