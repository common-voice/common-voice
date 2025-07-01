import React from 'react'
import { Localized } from '@fluent/react'

import { Button } from '../../../ui/ui'
import { PlusCircleIcon } from '../../../ui/icons'

// import { NoApiKeys } from './no-api-keys'
// import { CreateApiKey } from './create-api-key'
import { ApiKeyInfo } from './api-key-info'

import './api-credentials.css'

export const ApiCredentials = () => {
  return (
    <div className="api-credentials-container">
      <section className="api-credentials-description">
        <Localized id="api-credentials">
          <h2 />
        </Localized>
        <Localized id="api-credentials-description">
          <p />
        </Localized>
      </section>

      <section className="api-keys">
        <div className="api-keys-header">
          <Localized id="api-credentials-keys">
            <h2 />
          </Localized>

          <Button className="create-api-key-button" rounded>
            <PlusCircleIcon />
            <Localized id="create-api-key-button">
              <span />
            </Localized>
          </Button>
        </div>

        <div className="api-keys-box">
          <Localized id="your-api-keys">
            <h3 />
          </Localized>
        </div>
        <div className="api-keys-content">
          {/* <NoApiKeys /> */}
          {/* <CreateApiKey /> */}
          <ApiKeyInfo
            apiKeyName="First Key"
            publicApiKey="kfirnoiunrnug"
            secretApiKey="kegiurugbu09878kfkjnfin"
          />
        </div>
      </section>
    </div>
  )
}
