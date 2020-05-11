import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useAction } from '../../hooks/store-hooks';
import { Notifications } from '../../stores/notifications';
import { CrossIcon } from '../ui/icons';
import { LinkButton } from '../ui/ui';

import './notification-banner.css';

export const Banner = React.forwardRef(
  (
    {
      className,
      children,
      bannerProps,
      onClose,
      ...props
    }: {
      children: React.ReactNode;
      bannerProps: any;
      onClose: () => any;
    } & React.HTMLProps<HTMLDivElement>,
    ref: any
  ) => (
    <div ref={ref} className={'banner ' + className} {...props}>
      <h2 className="notification-text">{children}</h2>
      {bannerProps.links.map((cta: any, key: number) => (
        <LinkButton
          {...cta}
          key={`banner-link-${key}`}
          className="cta"
          onClick={onClose}
        />
      ))}
      <button type="button" className="close" onClick={onClose}>
        <CrossIcon />
      </button>
    </div>
  )
);

export default function NotificationBanner({
  notification,
}: {
  notification: Notifications.Notification;
}) {
  const removeNotification = useAction(Notifications.actions.remove);
  const [show, setShow] = useState(false);

  const el = useRef(null);
  const { storageKey = '' } =
    notification.kind == 'banner' && notification.bannerProps;

  useEffect(() => {
    setShow(true);
  }, []);

  function hideBanner(storageKey?: string) {
    setShow(false);
    storageKey && localStorage.setItem(storageKey, JSON.stringify(true));
  }

  return (
    <Banner
      ref={el}
      bannerProps={notification.kind == 'banner' && notification.bannerProps}
      onClose={() => hideBanner(storageKey)}
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
