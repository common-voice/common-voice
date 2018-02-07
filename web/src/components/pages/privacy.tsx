import * as React from 'react';
const { Localized } = require('fluent-react');

export default () => (
  <div id="privacy-container">
    <div className="privacy-content">
      <Localized id="privacy-title">
        <h1 />
      </Localized>
      <Localized id="privacy-effective">
        <h2 />
      </Localized>
      <Localized
        id="privacy-policy"
        policy={<a target="_blank" href="https://www.mozilla.org/privacy" />}>
        <p />
      </Localized>
      <ul>
        <Localized id="privacy-data-demographic" name={<b />}>
          <li />
        </Localized>
        <Localized id="privacy-data-account" name={<b />}>
          <li />
        </Localized>
        <Localized id="privacy-data-recordings" name={<b />}>
          <li />
        </Localized>
        <Localized id="privacy-data-interaction" name={<b />}>
          <li />
        </Localized>
        <Localized id="privacy-data-technical" name={<b />}>
          <li />
        </Localized>
      </ul>
      <Localized
        id="privacy-more"
        more={
          <a
            target="_blank"
            href="https://github.com/mozilla/voice-web/blob/master/docs/data_dictionary.md"
          />
        }>
        <span />
      </Localized>
    </div>
  </div>
);
