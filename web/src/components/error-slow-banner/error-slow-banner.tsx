import * as React from 'react';
import { Localized } from '@fluent/react';

import { ExternalLinkIcon } from '../ui/icons';
import NotificationBanner from './../notification-banner/notification-banner';
import { Notifications } from '../../stores/notifications';

const ErrorSlowBanner = () => {
  const notification: Notifications.Notification = {
    id: 99,
    kind: 'banner',
    content: (
      <>
        <Localized id="banner-error-slow-1" />
        <br />
        <Localized id="banner-error-slow-2" />
      </>
    ),
    bannerProps: {
      links: [
        {
          href: 'https://discourse.mozilla.org/t/common-voice-platform-status-page/93726',
          blank: true,
          persistAfterClick: true,
          className: 'cta external',
          children: (
            <>
              <ExternalLinkIcon />
              <Localized id="banner-error-slow-link" />
            </>
          ),
        },
      ],
    },
  };

  return (
    <NotificationBanner key="error-slow-banner" notification={notification} />
  );
};

export default ErrorSlowBanner;
