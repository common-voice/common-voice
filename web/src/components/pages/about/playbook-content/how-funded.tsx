import React from 'react'
import { Localized } from '@fluent/react'

import { COMMON_VOICE_EMAIL } from '../../../../constants'

const HowFunded = () => (
  <>
    <Localized
      id="about-playbook-how-funded-content-1"
      elems={{
        philantropicGrantLink: (
          <a
            href="https://foundation.mozilla.org/en/blog/mozilla-common-voice-dataset-grows-by-30-and-reaches-87-languages/"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}>
      <p />
    </Localized>
    <Localized
      id="about-playbook-how-funded-content-2"
      elems={{
        africaMradiLink: (
          <a
            href="https://wiki.mozilla.org/Africa_Mradi"
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
      }}>
      <p />
    </Localized>
    <Localized
      id="about-playbook-how-funded-content-3"
      elems={{
        donateLink: <a href="?form=FUNUAFTPPYR" />,
        emailFragment: (
          <a
            href={`mailto:${COMMON_VOICE_EMAIL}`}
            target="_blank"
            rel="noreferrer"
          />
        ),
      }}>
      <p />
    </Localized>
  </>
)

export default HowFunded
