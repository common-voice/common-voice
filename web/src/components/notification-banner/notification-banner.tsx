import * as React from 'react';
import { useRef, useState } from 'react';
import { useAction } from '../../hooks/store-hooks';
import { Notifications } from '../../stores/notifications';
import { CrossIcon } from '../ui/icons';
import { LinkButton } from '../ui/ui';
import VisuallyHidden from '../visually-hidden/visually-hidden';

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
      className: string;
      children: React.ReactNode;
      bannerProps: any;
      onClose: () => any;
    } & React.HTMLProps<HTMLDivElement>,
    ref: any
  ) => (
    <div ref={ref} className={'banner ' + className} {...props}>
      <p className="notification-text">{children}</p>
      {bannerProps.links.map((cta: any, key: number) => {
        const persistAfterClick = cta.persistAfterClick;
        delete cta.persistAfterClick;

        return (
          <LinkButton
            {...cta}
            key={`banner-link-${key}`}
            onClick={persistAfterClick ? null : onClose}
          />
        );
      })}
      <button type="button" className="close" onClick={onClose}>
        <VisuallyHidden>Close banner</VisuallyHidden>
        <CrossIcon />
      </button>
    </div>
  )
);
Banner.displayName = 'Banner';

export default function NotificationBanner({
  notification,
}: {
  notification: Notifications.Notification;
}) {
  const el = useRef(null);
  const [show, setShow] = useState(true);

  const removeNotification = useAction(Notifications.actions.remove);

  if (!show) {
    return null;
  }

  return (
    <Banner
      ref={el}
      bannerProps={notification.kind == 'banner' && notification.bannerProps}
      onClose={() => setShow(false)}
      className="notification-banner"
      onTransitionEnd={event => {
        if (show || event.target != el.current) return;
        removeNotification(notification.id);
      }}>
      {notification.content}
    </Banner>
  );
}
