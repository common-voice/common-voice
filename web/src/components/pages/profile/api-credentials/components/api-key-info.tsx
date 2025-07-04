import React from 'react'

import ApiKeyDisplay from './api-key-display'
import { Localized } from '@fluent/react'
import { InfoIcon } from '../../../../ui/icons'

type Props = {
  apiKeyData: { label: string; value: string }[]
}

export const ApiKeyInfo = ({ apiKeyData }: Props) => {
  return (
    <div className="api-key-info">
      {apiKeyData.map(({ label, value }) => (
        <ApiKeyDisplay
          key={label}
          apiKey={value}
          label={label}
          showButton={label !== 'API Key Name'}
        />
      ))}

      <div className="api-key-info-section">
        <div>
          <InfoIcon />
        </div>

        <div>
          <Localized id="save-api-key-info" elems={{ bold: <strong /> }}>
            <p className="description" />
          </Localized>
        </div>
      </div>
    </div>
  )
}
