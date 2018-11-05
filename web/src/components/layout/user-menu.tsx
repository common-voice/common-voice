import * as React from 'react';
import { connect } from 'react-redux';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import { DownIcon } from '../ui/icons';
import { Hr } from '../ui/ui';

import './user-menu.css';

interface PropsFromState {
  user: User.State;
}

const DefaultAvatar = () => (
  <div className="avatar-wrap">
    <img src="/img/mars-avatar.svg" alt="Robot Avatar" />
  </div>
);

//https://gravatar.com/avatar/asd.png?d=404
class UserMenu extends React.Component<PropsFromState> {
  state = { showMenu: false };

  toggleMenu = () => this.setState({ showMenu: !this.state.showMenu });
  showMenu = () => this.setState({ showMenu: true });
  hideMenu = () => this.setState({ showMenu: false });

  render() {
    const { user: { account } } = this.props;
    return (
      <div
        className={'user-menu ' + (this.state.showMenu ? 'active' : '')}
        onMouseEnter={this.showMenu}
        onMouseLeave={this.hideMenu}>
        <button className="toggle" onClick={this.toggleMenu}>
          <DefaultAvatar />
          <span className="name" title={account.username}>
            {account.username}
          </span>
          <DownIcon />
        </button>
        <div className="menu-wrap">
          <div className="menu">
            <span className="triangle" />

            <ul>
              <li>
                <LocaleLink to={URLS.PROFILE_PREFERENCES}>Settings</LocaleLink>
                <Hr />
              </li>
              <li>
                <a href="/logout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  user: state.user,
});

export default connect<PropsFromState>(mapStateToProps)(UserMenu);
