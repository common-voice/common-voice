import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { useRef } from 'react';
import { connect } from 'react-redux';
import { trackSharing } from '../../services/tracker';
import { Notifications } from '../../stores/notifications';
import { FontIcon } from '../ui/icons';
import { localeConnector, LocalePropsFromState } from '../locale-helpers';

import './share-buttons.css';

const SHARE_URL = 'https://voice.mozilla.org/';

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill;
}

interface Props
  extends LocalizationProps,
    PropsFromDispatch,
    LocalePropsFromState {
  shareText?: string;
}

function ShareButtons({
  addNotification,
  getString,
  locale,
  shareText,
}: Props) {
  const encodedShareText = encodeURIComponent(
    shareText
      ? shareText.replace('{link}', SHARE_URL)
      : getString('share-text', { link: SHARE_URL })
  );
  const shareURLInputRef = useRef(null);

  return (
    <React.Fragment>
      <button
        id="link-copy"
        className="share-button"
        onClick={() => {
          shareURLInputRef.current.select();
          document.execCommand('copy');
          trackSharing('link', locale);

          addNotification(
            <React.Fragment>
              <FontIcon type="link" className="icon" />{' '}
              <Localized id="link-copied">
                <span />
              </Localized>
            </React.Fragment>
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
        <FontIcon type="twitter" />
      </a>
    </React.Fragment>
  );
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    addNotification: Notifications.actions.addPill,
  }
)(localeConnector(withLocalization(ShareButtons)));
