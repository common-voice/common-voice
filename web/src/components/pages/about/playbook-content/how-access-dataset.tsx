import * as React from 'react'
import { Localized } from '@fluent/react'
import URLS from '../../../../urls'

const HowAddLanguage = React.memo(() => {
  const strong = <strong />

  return (
    <>
      <Localized
        id="about-playbook-how-access-dataset-content-1"
        elems={{
          datasetsPage: (
            <a
              href={URLS.MDC_DATASETS}
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          metadataLink: (
            <a
              href="https://github.com/common-voice/cv-dataset"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
      <Localized
        id="about-playbook-how-access-dataset-content-2"
        elems={{
          discourseLink: (
            <a
              href="https://discourse.mozilla.org/c/voice/using/661"
              target="_blank"
              rel="noopener noreferer"
            />
          ),
        }}>
        <p />
      </Localized>
    </>
  )
})

export default HowAddLanguage
