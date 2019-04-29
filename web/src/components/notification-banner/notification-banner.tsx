import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Notifications } from '../../stores/notifications';
import { CrossIcon } from '../ui/icons';
import { LinkButton } from '../ui/ui';

import './notification-banner.css';

interface PropsFromDispatch {
  removeNotification: typeof Notifications.actions.remove;
}

type Props = { notification: Notifications.Notification } & PropsFromDispatch;

function NotificationBanner({ notification, removeNotification }: Props) {
  const [show, setShow] = useState(false);

  const el = useRef(null);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div
      ref={el}
      className="notification-banner"
      style={{ transform: `translateY(${show ? 0 : -100}%)` }}
      onTransitionEnd={event => {
        if (show || event.target != el.current) return;

        removeNotification(notification.id);
      }}>
      <div className="spacer" />
      <h1>{notification.content}</h1>
      {notification.kind == 'banner' && (
        <LinkButton
          {...notification.actionProps}
          className="cta"
          onClick={() => setShow(false)}
        />
      )}
      <button type="button" className="close" onClick={() => setShow(false)}>
        <CrossIcon />
      </button>
    </div>
  );
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    removeNotification: Notifications.actions.remove,
  }
)(NotificationBanner);
