import * as React from 'react';
import { Localized } from 'fluent-react';

export default () => (
  <div id="not-found-container">
    <Localized id="notfound-title">
      <h2 />
    </Localized>
    <Localized id="notfound-content">
      <p />
    </Localized>
  </div>
);
