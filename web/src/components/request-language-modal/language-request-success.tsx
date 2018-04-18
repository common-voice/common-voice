import { Localized } from 'fluent-react';
import * as React from 'react';
import { SuccessIcon } from '../ui/icons';

export default ({ onRequestClose }: { onRequestClose: () => void }) => (
  <React.Fragment>
    <div className="title-and-action">
      <div />
      <Localized id="request-language-cancel">
        <a href="javascript:void(0)" onClick={onRequestClose} />
      </Localized>
    </div>

    <br />

    <SuccessIcon />

    <Localized id="request-language-success-title">
      <h2 />
    </Localized>

    <br />

    <Localized id="request-language-success-content">
      <p className="small" />
    </Localized>

    <br />

    <Localized id="return-to-cv">
      <a
        href="javascript:void(0)"
        onClick={onRequestClose}
        className="small"
        style={{ fontWeight: 'bold', color: 'black' }}
      />
    </Localized>

    <br />
    <br />
  </React.Fragment>
);
