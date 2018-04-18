import * as React from 'react';
import { Localized } from 'fluent-react';

export default () => (
  <div id="faq-container">
    <Localized id="faq-title">
      <h1 />
    </Localized>
    <Localized id="faq-what-q">
      <h3 />
    </Localized>
    <Localized id="faq-what-a">
      <p />
    </Localized>

    <Localized id="faq-important-q">
      <h3 />
    </Localized>
    <Localized id="faq-important-a">
      <p />
    </Localized>

    <Localized id="faq-get-q">
      <h3 />
    </Localized>
    <Localized
      id="faq-get-a"
      downloadLink={<a href="http://voice.mozilla.org/data" />}
      licenseLink={
        <a href="https://creativecommons.org/publicdomain/zero/1.0/" />
      }>
      <p />
    </Localized>

    <Localized id="faq-mission-q">
      <h3 />
    </Localized>
    <Localized id="faq-mission-a">
      <p />
    </Localized>

    <Localized id="faq-native-q" $lang="English">
      <h3 />
    </Localized>
    <Localized id="faq-native-a" bold={<b />}>
      <p />
    </Localized>

    <Localized id="faq-firefox-q">
      <h3 />
    </Localized>
    <Localized id="faq-firefox-a">
      <p />
    </Localized>

    <Localized id="faq-quality-q">
      <h3 />
    </Localized>
    <Localized id="faq-quality-a">
      <p />
    </Localized>

    <Localized id="faq-hours-q">
      <h3 />
    </Localized>
    <Localized id="faq-hours-a">
      <p />
    </Localized>

    <Localized id="faq-source-q">
      <h3 />
    </Localized>
    <Localized id="faq-source-a1" italic={<i />}>
      <p />
    </Localized>
    <Localized
      id="faq-source-a2"
      dataLink={
        <a
          target="_blank"
          href="https://github.com/mozilla/voice-web/blob/master/server/data/"
        />
      }>
      <p />
    </Localized>
  </div>
);
