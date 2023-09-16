import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
import * as React from 'react';
import { useRef } from 'react';
import { trackSharing } from '../../services/tracker';
import { Notifications } from '../../stores/notifications';
import { FontIcon } from '../ui/icons';
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
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
        </svg>
      </a>
    </>
  );
}

export default withLocalization(ShareButtons);
