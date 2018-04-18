import { Localized } from 'fluent-react';
import * as React from 'react';

export default () => (
  <React.Fragment>
    <Localized id="stayintouch">
      <p className="small" />
    </Localized>
    <br />

    <Localized
      id="privacy-info"
      privacyLink={
        <a href="/privacy" target="__blank" rel="noopener noreferrer" />
      }>
      <p className="small" />
    </Localized>
  </React.Fragment>
);
