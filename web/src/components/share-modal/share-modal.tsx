import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import Modal from '../modal/modal';
import ShareButtons from '../share-buttons/share-buttons';

import './share-modal.css';

export default ({
  shareText,
  title,
  text,
  ...props
}: {
  onRequestClose: () => any;
  shareText?: string;
  title?: React.ReactNode;
  text?: React.ReactNode;
}) => (
  <Modal innerClassName="share-modal" {...props}>
    <div className="image-container">
      <img className="mars" src="/img/mars.svg" alt="Robot" />
    </div>
    {title ? (
      <h1>{title}</h1>
    ) : (
      <Localized id="share-title-new" bold={<b />}>
        <h1 />
      </Localized>
    )}
    {text && <p>{text}</p>}
    <div className="share-buttons">
      <ShareButtons {...{ shareText }} />
    </div>
  </Modal>
);
