import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import Modal from '../../modal/modal';
import ShareButtons from '../../share-buttons/share-buttons';

import './share-modal.css';

export default (props: { onRequestClose: () => any }) => (
  <Modal innerClassName="share-modal" {...props}>
    <div className="image-container">
      <img className="mars" src="/img/mars.svg" alt="Robot" />
    </div>
    <Localized id="share-title-new" bold={<b />}>
      <h1 />
    </Localized>
    <div className="share-buttons">
      <ShareButtons />
    </div>
  </Modal>
);
