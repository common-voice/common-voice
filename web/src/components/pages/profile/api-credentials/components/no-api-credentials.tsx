import React from 'react'
import { Localized } from '@fluent/react'

import { InfoIcon } from '../../../../ui/icons'

export const NoApiCredentials = () => {
  return (
    <div className="no-api-keys-container">
      <div>
        <InfoIcon />
      </div>

      <div>
        <Localized id="no-api-keys-header" elems={{ bold: <strong /> }}>
          <p className="header" />
        </Localized>
        <Localized id="no-api-keys-description">
          <p className="description" />
        </Localized>
      </div>
    </div>
  )
}
