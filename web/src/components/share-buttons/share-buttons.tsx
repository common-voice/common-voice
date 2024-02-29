import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useRef } from 'react';
import { trackSharing } from '../../services/tracker';
import { Notifications } from '../../stores/notifications';
import { FontIcon, XIcon } from '../ui/icons';
import { useLocale } from '../locale-helpers';
import URLS from '../../urls';

import './share-buttons.css';
import { useAction } from '../../hooks/store-hooks';

const SHARE_URL = URLS.HTTP_ROOT;

interface Props extends WithLocalizationProps {
  shareTextId?: string;
}

function ShareButtons({ getString, shareTextId }: Props) {
  const [locale] = useLocale();
  const addNotification = useAction(Notifications.actions.addPill);
  const encodedShareText = encodeURIComponent(
    shareTextId
      ? getString(shareTextId, { link: SHARE_URL })
      : getString('share-text', { link: SHARE_URL })
  );
  const shareURLInputRef = useRef(null);

  return (
    <>
      <button
        id="link-copy"
        className="share-button"
        onClick={() => {
          shareURLInputRef.current.select();
          document.execCommand('copy');
          trackSharing('link', locale);

          addNotification(
            <>
              <FontIcon type="link" className="icon" />{' '}
              <Localized id="link-copied">
                <span />
              </Localized>
            </>
          );
        }}>
        <input type="text" readOnly value={SHARE_URL} ref={shareURLInputRef} />
        <FontIcon type="link" />
      </button>
      <a
        className="share-button"
        href={
          'https://www.facebook.com/sharer/sharer.php?u=' +
          encodeURIComponent(SHARE_URL)
        }
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSharing('facebook', locale)}>
        <FontIcon type="facebook" />
      </a>
      <a
        className="share-button"
        href={'https://twitter.com/intent/tweet?text=' + encodedShareText}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackSharing('twitter', locale)}>
        <XIcon />
      </a>
    </>
  );
}

export default withLocalization(ShareButtons);
