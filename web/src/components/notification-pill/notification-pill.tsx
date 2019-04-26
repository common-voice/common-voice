import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Notifications } from '../../stores/notifications';

import './notification-pill.css';

const NOTIFICATION_TIMEOUT_MS = 3000;

interface PropsFromDispatch {
  removeNotification: typeof Notifications.actions.remove;
}

type Props = { notification: Notifications.Notification } & PropsFromDispatch;

function NotificationPill({ notification, removeNotification }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(false), NOTIFICATION_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={
        'notification-pill ' +
        (notification.kind == 'pill' ? notification.type : '')
      }
      style={{ opacity: show ? 1 : 0 }}
      onTransitionEnd={() => removeNotification(notification.id)}>
      {notification.content}
    </div>
  );
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    removeNotification: Notifications.actions.remove,
  }
)(NotificationPill);
