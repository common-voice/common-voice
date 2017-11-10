import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import API from '../../../api';
import User from '../../../user';
import Validator from '../../validator';
import Icon from '../../icon';

interface Props extends RouteComponentProps<any> {
  api: API;
  user?: User;
}

interface State {
  showWallOfText: boolean;
}

class Home extends React.Component<Props, {}> {
  state = {
    showWallOfText: false,
  };

  onVote = () => {
    this.props.user && this.props.user.tallyVerification();
  };

  render() {
    const { showWallOfText } = this.state;
    return (
      <div id="home-container">
        <h1 id="home-title">
          The Common Voice project is Mozilla's initiative to help teach
          machines how real people speak.
        </h1>
        <div id="wall-of-text">
          <Link id="contribute-button" to="/record">
            <div id="record-icon" />
            Speak up, contribute here!
          </Link>

          <p>
            Voice is natural, voice is human. That’s why we’re fascinated with
            creating usable voice technology for our machines. But to create
            voice systems, an extremely large amount of voice data is required.
            Most of the data used by large companies isn’t available to the
            majority of people. We think that stifles innovation. So we’ve
            launched Project Common Voice, a project to help make voice
            recognition open to everyone.{' '}
            {showWallOfText &&
              'Now you can donate your voice to help us build an open-source voice database' +
                'that anyone can use to make innovative apps for devices and the web.'}
          </p>

          {!showWallOfText && (
            <a
              id="show-more-text"
              onClick={() => this.setState({ showWallOfText: true })}>
              Read More
            </a>
          )}

          {showWallOfText && (
            <p>
              Read a sentence to help machines learn how real people speak.
              Check the work of other contributors to improve the quality. It’s
              that simple!
            </p>
          )}
        </div>

        <hr />

        <div>
          <h1>Help us validate sentences!</h1>
          <div id="help-explain">
            Press play, listen & tell us: did they accurately speak the sentence
            below?
          </div>

          <Validator onVote={this.onVote} api={this.props.api} />
        </div>

        <br />
      </div>
    );
  }
}
export default withRouter(Home);
