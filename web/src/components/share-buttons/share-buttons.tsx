import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackSharing } from '../../services/tracker';
import { Notifications } from '../../stores/notifications';
import { FontIcon } from '../ui/icons';
import { localeConnector, LocalePropsFromState } from '../locale-helpers';

import './share-buttons.css';

const SHARE_URL = 'https://voice.mozilla.org/';

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.add;
}

type Props = LocalizationProps & PropsFromDispatch & LocalePropsFromState;

class ShareButtons extends React.Component<Props> {
  shareURLInputRef: { current: HTMLInputElement | null } = React.createRef();

  private copyShareURL = () => {
    const { addNotification, locale } = this.props;
    this.shareURLInputRef.current.select();
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
  };

  render() {
    const { getString, locale } = this.props;
    const encodedShareText = encodeURIComponent(
      getString('share-text', { link: SHARE_URL })
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
          onClick={() => trackSharing('twitter', locale)}>
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
          onClick={() => trackSharing('facebook', locale)}>
          <FontIcon type="facebook" />
        </a>
      </React.Fragment>
    );
  }
}

export default connect<void, PropsFromDispatch>(
  null,
  {
    addNotification: Notifications.actions.add,
  }
)(localeConnector(withLocalization(ShareButtons)));
