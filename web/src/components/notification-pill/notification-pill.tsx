import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAction } from '../../hooks/store-hooks';
import { Notifications } from '../../stores/notifications';

import './notification-pill.css';

const NOTIFICATION_TIMEOUT_MS = 3000;

export default function NotificationPill({
  notification,
}: {
  notification: Notifications.Notification;
}) {
  const removeNotification = useAction(Notifications.actions.remove);
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
      {notification.kind === 'pill' && notification.type === 'achievement' && (
        <img src={require('../pages/dashboard/awards/star.svg')} alt="star" />
      )}
      {notification.content}
    </div>
  );
}
