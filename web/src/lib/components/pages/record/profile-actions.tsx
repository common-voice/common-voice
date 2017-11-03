import { h, Component } from 'preact';
import ProfileForm from '../../profile-form/profile-form';
import User from '../../../user';
import messages from '../../../../messages';

interface WhyProfileState {
  expanded: boolean;
}

class WhyProfile extends Component<{}, WhyProfileState> {
  state = { expanded: false };

  private toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { expanded } = this.state;
    return (
      <div>
        <div id="why-profile-title">
          {expanded ? (
            messages.WHY_PROFILE.TITLE
          ) : (
            <a onClick={this.toggle}>{messages.WHY_PROFILE.TITLE}</a>
          )}
        </div>
        {expanded && (
          <div id="why-profile">
            <p id="why-profile-text">{messages.WHY_PROFILE.CONTENT}</p>
            <a onClick={this.toggle}>Close</a>
          </div>
        )}
      </div>
    );
  }
}

interface Props {
  navigate(url: string): void;
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
        {!profileFormVisible && <hr />}
        {this.props.user.hasEnteredInfo() ? (
          <a
            href="/profile"
            onClick={evt => {
              evt.preventDefault();
              this.props.navigate('/profile');
            }}>
            Edit Profile
          </a>
        ) : (
          <div>
            {profileFormVisible ? (
              <div id="profile-form-container">
                <ProfileForm
                  user={this.props.user}
                  onExit={this.toggleProfileForm}
                />
              </div>
            ) : (
              <button
                type="button"
                id="create-profile-button"
                onClick={this.toggleProfileForm}>
                Create a profile
              </button>
            )}
            <WhyProfile />
          </div>
        )}
      </div>
    );
  }
}
