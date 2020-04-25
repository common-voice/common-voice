import { Localized } from 'fluent-react/compat';
import * as React from 'react';

export default ({ localizedPrefix }: { localizedPrefix?: string }) => {
  localizedPrefix = localizedPrefix || '';
  return (
    <>
      <Localized id={localizedPrefix + 'stayintouch'}>
        <p className="small" />
      </Localized>
      <br />

      <Localized
        id={localizedPrefix + 'privacy-info'}
        privacyLink={
          <a href="/privacy" target="_blank" rel="noopener noreferrer" />
        }>
        <p className="small" />
      </Localized>
    </>
  );
};
