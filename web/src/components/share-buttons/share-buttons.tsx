import { LocalizationProps, withLocalization } from 'fluent-react';
import * as React from 'react';
import { trackSharing } from '../../services/tracker';
import { FontIcon } from '../ui/icons';

import './share-buttons.css';

const SHARE_URL = 'https://voice.mozilla.org/';

class ShareButtons extends React.Component<LocalizationProps> {
  shareURLInputRef: { current: HTMLInputElement | null } = React.createRef();

  private copyShareURL = () => {
    this.shareURLInputRef.current.select();
    document.execCommand('copy');
    trackSharing('link');
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

export default withLocalization(ShareButtons);
