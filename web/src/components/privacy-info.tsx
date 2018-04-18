import { Localized } from 'fluent-react';
import * as React from 'react';

export default ({ localizedPrefix }: { localizedPrefix?: string }) => {
  localizedPrefix = localizedPrefix || '';
  return (
    <React.Fragment>
      <Localized id={localizedPrefix + 'stayintouch'}>
        <p className="small" />
      </Localized>
      <br />

      <Localized
        id={localizedPrefix + 'privacy-info'}
        privacyLink={
          <a href="/privacy" target="__blank" rel="noopener noreferrer" />
        }>
        <p className="small" />
      </Localized>
    </React.Fragment>
  );
};
