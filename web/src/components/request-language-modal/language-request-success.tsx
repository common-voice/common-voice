import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { SuccessIcon } from '../ui/icons';
import { TextButton } from '../ui/ui';

export default ({ onRequestClose }: { onRequestClose: () => void }) => (
  <>
    <SuccessIcon className="success" />

    <Localized id="request-language-success-title">
      <h2 />
    </Localized>

    <br />

    <Localized id="request-language-success-content">
      <p className="small" />
    </Localized>

    <br />

    <Localized id="return-to-cv">
      <TextButton
        onClick={onRequestClose}
        className="small"
        style={{ fontWeight: 'bold', color: 'black' }}
      />
    </Localized>

    <br />
    <br />
  </>
);
