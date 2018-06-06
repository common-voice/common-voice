import { Localized } from 'fluent-react';
import * as React from 'react';
import Modal from '../../modal/modal';
import ShareButtons from '../../share-buttons/share-buttons';

import './share-modal.css';

export default (props: { onRequestClose: () => any }) => (
  <Modal innerClassName="share-modal" {...props}>
    <img className="share-image" src="/img/share.png" alt="Robot & Waves" />
    <Localized id="share-title-new" bold={<b />}>
      <h1 />
    </Localized>
    <div className="share-buttons">
      <ShareButtons />
    </div>
  </Modal>
);
