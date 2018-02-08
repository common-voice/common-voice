import * as React from 'react';
const { Localized } = require('fluent-react');

export default () => (
  <div id="terms-container">
    <div className="terms-content">
      <Localized id="terms-title">
        <h1 />
      </Localized>
      <Localized id="terms-effective" $date={new Date('June 19, 2017')}>
        <h2 />
      </Localized>
      <Localized id="terms-eligibility-title">
        <h3 />
      </Localized>
      <Localized id="terms-eligibility-content">
        <p />
      </Localized>
      <Localized id="terms-privacy-title">
        <h3 />
      </Localized>
      <Localized id="terms-privacy-content" privacyLink={<a href="/privacy" />}>
        <p />
      </Localized>
      <Localized id="terms-contributions-title">
        <h3 />
      </Localized>
      <Localized
        id="terms-contributions-content"
        licenseLink={
          <a href="https://creativecommons.org/publicdomain/zero/1.0/" />
        }>
        <p />
      </Localized>
      <Localized id="terms-communications-title">
        <h3 />
      </Localized>
      <Localized id="terms-communications-content">
        <p />
      </Localized>
      <Localized id="terms-general-title">
        <h3 />
      </Localized>
      <Localized id="terms-general-liability1">
        <p />
      </Localized>
      <Localized id="terms-general-liability2">
        <p />
      </Localized>
      <Localized id="terms-general-liability3">
        <p />
      </Localized>
      <Localized id="terms-general-liability4">
        <p />
      </Localized>
      <Localized id="terms-general-updates">
        <p />
      </Localized>
      <Localized id="terms-general-termination">
        <p />
      </Localized>
      <Localized id="terms-general-law">
        <p />
      </Localized>
    </div>
  </div>
);
