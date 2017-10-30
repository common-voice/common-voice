import { h, Component } from 'preact';
import Profile from '../profile/profile';
import User from '../../../user';

interface WhyProfileProps {
  onClose: () => any;
}

const WhyProfile = ({ onClose }: WhyProfileProps) => (
  <div>
    <span id="why-profile-title">Why a profile?</span>
    <div id="why-profile">
      <p id="why-profile-text">
        Copy explaining value of profile &amp; demographic capture: Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Nulla id orci dui.
      </p>
      <p>
        <a name="" onClick={onClose}>
          Close
        </a>
      </p>
    </div>
  </div>
);

interface Props {
  user: User;
}

interface State {
  profileFormVisible: boolean;
  whyProfileVisible: boolean;
}

export default class ProfileActions extends Component<Props, State> {
  state: State = {
    profileFormVisible: false,
    whyProfileVisible: false,
  };

  private toggleProfileForm = () => {
    this.setState({ profileFormVisible: !this.state.profileFormVisible });
  };

  private toggleWhyProfile = () => {
    this.setState({ whyProfileVisible: !this.state.whyProfileVisible });
  };

  render() {
    return (
      <div id="profile-actions">
        <hr />
        {this.state.profileFormVisible ? (
          <div id="profile-form-container">
            <a class="cancel" onClick={this.toggleProfileForm}>
              Cancel
            </a>
            <Profile active="" user={this.props.user} />
          </div>
        ) : this.props.user.hasEnteredInfo() ? (
          <a onClick={this.toggleProfileForm}>Edit Profile</a>
        ) : (
          this.renderOnboarding()
        )}
      </div>
    );
  }

  private renderOnboarding() {
    const { profileFormVisible, whyProfileVisible } = this.state;
    return [
      !profileFormVisible && (
        <button
          type="button"
          id="create-profile-button"
          onClick={this.toggleProfileForm}>
          Create a profile
        </button>
      ),
      whyProfileVisible ? (
        <WhyProfile onClose={this.toggleWhyProfile} />
      ) : (
        <div id="why-profile-title">
          <a onClick={this.toggleWhyProfile}>Why a profile?</a>
        </div>
      ),
    ];
  }
}
