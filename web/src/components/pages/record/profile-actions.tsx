import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ProfileForm from '../../profile-form/profile-form';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import messages from '../../../messages';
import Alert from '../../alert/alert';
import { Button, Hr } from '../../ui/ui';
const { Localized } = require('fluent-react');

interface WhyProfileState {
  expanded: boolean;
}

class WhyProfile extends React.Component<{}, WhyProfileState> {
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
            <Localized id="record-profile-why-title">
              <span />
            </Localized>
          ) : (
            <Localized id="record-profile-why-title">
              <a href="javascript:void(0)" onClick={this.toggle} />
            </Localized>
          )}
        </div>
        {expanded && (
          <div id="why-profile">
            <Localized id="record-profile-why-text">
              <p id="why-profile-text" />
            </Localized>
            <Localized id="record-profile-why-close">
              <a href="javascript:void(0)" onClick={this.toggle} />
            </Localized>
          </div>
        )}
      </div>
    );
  }
}

interface PropsFromState {
  hasEnteredInfo: boolean;
}

interface State {
  profileFormVisible: boolean;
  alertVisible: boolean;
}

class ProfileActions extends React.Component<PropsFromState, State> {
  state: State = {
    profileFormVisible: false,
    alertVisible: false,
  };

  private toggleProfileForm = () => {
    this.setState({
      profileFormVisible: !this.state.profileFormVisible,
      alertVisible: this.props.hasEnteredInfo,
    });
  };

  private closeAlert = () => {
    this.setState({
      alertVisible: false,
    });
  };

  render() {
    const { profileFormVisible, alertVisible } = this.state;
    return (
      <div id="profile-actions">
        {!profileFormVisible && <Hr />}
        {alertVisible && (
          <Localized id="record-profile-created">
            <Alert autoHide onClose={this.closeAlert} />
          </Localized>
        )}
        {this.props.hasEnteredInfo ? (
          <Localized id="record-profile-edit">
            <Link to="/profile" />
          </Localized>
        ) : (
          <div>
            {profileFormVisible ? (
              <div id="profile-form-container">
                <ProfileForm onExit={this.toggleProfileForm} />
              </div>
            ) : (
              <Localized id="record-profile-create">
                <Button outline onClick={this.toggleProfileForm} />
              </Localized>
            )}
            <WhyProfile />
          </div>
        )}
      </div>
    );
  }
}

export default connect<PropsFromState>(({ user }: StateTree) => ({
  hasEnteredInfo: User.selectors.hasEnteredInfo(user),
}))(ProfileActions);
