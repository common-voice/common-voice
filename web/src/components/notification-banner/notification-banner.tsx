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

export const Banner = React.forwardRef(
  (
    {
      className,
      children,
      ctaButtonProps,
      onClose,
      ...props
    }: {
      children: React.ReactNode;
      ctaButtonProps: any;
      onClose: () => any;
    } & React.HTMLProps<HTMLDivElement>,
    ref: any
  ) => (
    <div ref={ref} className={'banner ' + className} {...props}>
      <div className="spacer" />
      <h1>{children}</h1>
      <LinkButton {...ctaButtonProps} className="cta" onClick={onClose} />
      <button type="button" className="close" onClick={onClose}>
        <CrossIcon />
      </button>
    </div>
  )
);

function NotificationBanner({ notification, removeNotification }: Props) {
  const [show, setShow] = useState(false);

  const el = useRef(null);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Banner
      ref={el}
      ctaButtonProps={
        notification.kind == 'banner'
          ? {
              ...notification.actionProps,
              className: 'cta',
            }
          : {}
      }
      onClose={() => setShow(false)}
      className="notification-banner"
      style={{ transform: `translateY(${show ? 0 : -100}%)` }}
      onTransitionEnd={event => {
        if (show || event.target != el.current) return;

        removeNotification(notification.id);
      }}>
      {notification.content}
    </Banner>
  );
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    removeNotification: Notifications.actions.remove,
  }
)(NotificationBanner);
