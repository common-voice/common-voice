import * as React from 'react';
import { Localized } from '@fluent/react';

const WhatIsLanguage = React.memo(() => {
  return (
    <>
      <Localized id="about-playbook-what-is-language-content-1">
        <p />
      </Localized>
      <Localized id="about-playbook-what-is-language-content-2">
        <p />
      </Localized>
      <Localized
        id="about-playbook-what-is-language-content-3"
        elems={{
          ctaLink: (
            <a
              href="https://foundation.mozilla.org/en/blog/how-we-are-making-common-voice-even-more-linguistically-inclusive/"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
    </>
  );
});

export default WhatIsLanguage;
