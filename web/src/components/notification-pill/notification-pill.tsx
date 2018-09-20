import * as React from 'react';
import { connect } from 'react-redux';
import { Notifications } from '../../stores/notifications';

import './notification-pill.css';

const NOTIFICATION_TIMEOUT_MS = 3000;

interface PropsFromDispatch {
  removeNotification: typeof Notifications.actions.remove;
}

class NotificationPill extends React.Component<
  Notifications.Notification & PropsFromDispatch
> {
  state = { show: true };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: false });
    }, NOTIFICATION_TIMEOUT_MS);
  }

  remove = () => {
    const { id, removeNotification } = this.props;
    removeNotification(id);
  };

  render() {
    return (
      <div
        className="notification-pill"
        style={{ opacity: this.state.show ? 1 : 0 }}
        onTransitionEnd={this.remove}>
        {this.props.content}
      </div>
    );
  }
}

export default connect<void, PropsFromDispatch>(null, {
  removeNotification: Notifications.actions.remove,
})(NotificationPill);
