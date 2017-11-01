import { h, Component } from 'preact';
import Profile from '../profile/profile';
import User from '../../../user';

interface WhyProfileState {
  expanded: boolean;
}

const WHY_PROFILE_TITLE = 'Why a profile?';

class WhyProfile extends Component<{}, WhyProfileState> {
  state = { expanded: false };

  private toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return this.state.expanded ? (
      <div>
        <span id="why-profile-title">{WHY_PROFILE_TITLE}</span>
        <div id="why-profile">
          <p id="why-profile-text">
            By providing some information about yourself, the audio data you
            submit to Common Voice will be more useful to Speech Recognition
            engines that use this data to improve their accuracy.
          </p>
          <p>
            <a name="" onClick={this.toggle}>
              Close
            </a>
          </p>
        </div>
      </div>
    ) : (
      <div id="why-profile-title">
        <a onClick={this.toggle}>{WHY_PROFILE_TITLE}</a>
      </div>
    );
  }
}

interface Props {
  user: User;
}

interface State {
  profileFormVisible: boolean;
}

export default class ProfileActions extends Component<Props, State> {
  state: State = {
    profileFormVisible: false,
  };

  private toggleProfileForm = () => {
    this.setState({ profileFormVisible: !this.state.profileFormVisible });
  };

  render() {
    const { profileFormVisible } = this.state;
    return (
      <div id="profile-actions">
        <hr />
        <br />
        {profileFormVisible ? (
          <div id="profile-form-container">
            <a class="cancel" onClick={this.toggleProfileForm}>
              Cancel
            </a>
            <Profile active="" user={this.props.user} />
          </div>
        ) : this.props.user.hasEnteredInfo() ? (
          <a onClick={this.toggleProfileForm}>Edit Profile</a>
        ) : (
          [
            <button
              type="button"
              id="create-profile-button"
              onClick={this.toggleProfileForm}>
              Create a profile
            </button>,
            <WhyProfile />,
          ]
        )}
      </div>
    );
  }
}
