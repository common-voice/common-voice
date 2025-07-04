import React from 'react'

import { TrashIcon } from '../../../../ui/icons'

import ApiKeyDisplay from './api-key-display'

type Props = {
  apiKeys: {
    keyName: string
    publicKey: string
    secretKey: string
  }[]
  onDeleteApiKey: (keyName: string) => void
}

export const ApiKeysList = ({ apiKeys, onDeleteApiKey }: Props) => {
  return (
    <div className="api-keys-list-container">
      {apiKeys.map(apiKey => (
        <div key={apiKey.keyName} className="api-key-item-header">
          <div className="api-key-header">
            <p className="api-keyname">{apiKey.keyName}</p>
            <button onClick={() => onDeleteApiKey(apiKey.keyName)}>
              <TrashIcon />
            </button>
          </div>
          <ApiKeyDisplay
            showButton
            apiKey={apiKey.publicKey}
            label="public-api-key"
            isHiddenDisplayMode
          />
          <ApiKeyDisplay
            apiKey={apiKey.secretKey}
            label="secret-api-key"
            isHiddenDisplayMode
          />
        </div>
      ))}
    </div>
  )
}
