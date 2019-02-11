import * as React from 'react';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Notifications } from '../../stores/notifications';

import './notification-pill.css';

const NOTIFICATION_TIMEOUT_MS = 3000;

interface PropsFromDispatch {
  removeNotification: typeof Notifications.actions.remove;
}

type Props = Notifications.Notification & PropsFromDispatch;

function NotificationPill({ content, id, removeNotification, type }: Props) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShow(false), NOTIFICATION_TIMEOUT_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div
      className={'notification-pill ' + type}
      style={{ opacity: show ? 1 : 0 }}
      onTransitionEnd={() => removeNotification(id)}>
      {content}
    </div>
  );
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    removeNotification: Notifications.actions.remove,
  }
)(NotificationPill);
