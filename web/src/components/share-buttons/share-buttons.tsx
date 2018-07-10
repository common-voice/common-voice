import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackSharing } from '../../services/tracker';
import { Notifications } from '../../stores/notifications';
import { FontIcon } from '../ui/icons';

import './share-buttons.css';

const SHARE_URL = 'https://voice.mozilla.org/';

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.add;
}

class ShareButtons extends React.Component<
  LocalizationProps & PropsFromDispatch
> {
  shareURLInputRef: { current: HTMLInputElement | null } = React.createRef();

  private copyShareURL = () => {
    this.shareURLInputRef.current.select();
    document.execCommand('copy');
    trackSharing('link');

    this.props.addNotification(
      <React.Fragment>
        <FontIcon type="link" className="icon" />{' '}
        <Localized id="link-copied">
          <span />
        </Localized>
      </React.Fragment>
    );
  };

  render() {
    const encodedShareText = encodeURIComponent(
      this.props.getString('share-text', { link: SHARE_URL })
    );
    return (
      <React.Fragment>
        <button
          id="link-copy"
          className="share-button"
          onClick={this.copyShareURL}>
          <input
            type="text"
            readOnly
            value={SHARE_URL}
            ref={this.shareURLInputRef}
          />
          <FontIcon type="link" />
        </button>
        <a
          className="share-button"
          href={'https://twitter.com/intent/tweet?text=' + encodedShareText}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSharing('twitter')}>
          <FontIcon type="twitter" />
        </a>
        <a
          className="share-button"
          href={
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(SHARE_URL)
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackSharing('facebook')}>
          <FontIcon type="facebook" />
        </a>
      </React.Fragment>
    );
  }
}

export default connect<void, PropsFromDispatch>(null, {
  addNotification: Notifications.actions.add,
})(withLocalization(ShareButtons));
