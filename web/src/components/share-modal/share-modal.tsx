import { Localized } from '@fluent/react';
import * as React from 'react';
import Modal from '../modal/modal';
import ShareButtons from '../share-buttons/share-buttons';

import './share-modal.css';

export default function ShareModal({
  shareTextId,
  title,
  text,
  ...props
}: {
  onRequestClose: () => any;
  shareTextId?: string;
  title?: React.ReactNode;
  text?: React.ReactNode;
}) {
  <Modal innerClassName="share-modal" {...props}>
    <div className="image-container">
      <img className="mars" src="/img/mars.svg" alt="voice robot" />
    </div>
    {title ? (
      <h1>{title}</h1>
    ) : (
      <Localized id="share-title-new" elems={{ bold: <b /> }}>
        <h1 />
      </Localized>
    )}
    {text && <p>{text}</p>}
    <div className="share-buttons">
      <ShareButtons {...{ shareTextId }} />
    </div>
  </Modal>;
}
