import pick = require('lodash.pick');
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import API from '../../../services/api';
import { User } from '../../../stores/user';
import Validator from '../../validator';
import { RecordIcon } from '../../ui/icons';
import { CardAction, Hr } from '../../ui/ui';
import ProjectStatus from './project-status';

interface PropsFromState {
  api: API;
}

interface PropsFromDispatch {
  tallyVerification: typeof User.actions.tallyVerification;
}

interface Props
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface State {
  showWallOfText: boolean;
}

class Home extends React.Component<Props, {}> {
  state = {
    showWallOfText: false,
  };

  onVote = () => {
    this.props.tallyVerification();
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
          <CardAction id="contribute-button" to="/record">
            <div>
              <RecordIcon />
            </div>
            Speak up, contribute here!
          </CardAction>

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
                ' that anyone can use to make innovative apps for devices and the web.'}
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

        <Hr />

        <div>
          <h1>Help us validate sentences!</h1>
          <div id="help-explain">
            Press play, listen & tell us: did they accurately speak the sentence
            below?
          </div>

          <Validator onVote={this.onVote} />
        </div>

        <br />
        <Hr />
        <br />

        <ProjectStatus />

        <br />
      </div>
    );
  }
}
export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    state => pick(state, 'api'),
    pick(User.actions, 'tallyVerification')
  )(Home)
);
